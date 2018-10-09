// Import only what we need from express
import { Request, Response, Router } from "express";

import config from "../../config.json";
import * as db from "../../db";
import { UserExperienceUpdate } from "../datatypes";

const router: Router = Router();

router.post("/experience", async (req: Request, res: Response) => {
	const body = req.body;

	// Api key checking
	if (!body.apiKey){
		res.status(400).send("Properties wrong or missing.");
		return;
	}
	else if (body.apiKey !== config.kurisuApiKey){
		// This at the moment only checks if it matches the config, in the future this will also check against the database
		res.status(401).send("Unauthorized");
		return;
	}
	// Checks to see whether or not all the properties needed are sent through
	if (!(body.userId && body.username && body.discriminator && body.xpGain !== null)){
		res.status(400).send("Properties wrong or missing.");
		return;
	}

	// Gets userdata, or creates new if not found
	let userData = await db.UserLevels.findOrCreate(
		{
		raw: true,
		where: {
			userid: body.userId,
		},
		defaults: {
			userid: body.userId,
			username: body.username,
			discriminator: body.discriminator,
			totalxp: 0,
			currentxp: 0,
			level: 0,
		},
	});

	// Updates or creates table entry
	await db.UserLevels.upsert({
		currentxp: userData[0].currentxp + body.xpGain,
		userid: body.userId,
		discriminator: body.discriminator,
		username: body.username,
		level: userData[0].level,
		totalxp: userData[0].totalxp + body.xpGain,
	}, {});

	// Only if guildid was passed, update guildscores, otherwise only xp
	if (body.guildId){
		const guildScore = await db.GuildScores.findOrCreate(
		{
			raw: true,
			where: {
				userid: body.userId,
				guildid: body.guildId,
			},
			defaults: {
				userid: body.userId,
				guildid: body.guildId,
				score: 0,
			},
		});

		await db.GuildScores.upsert({
			userid: body.userId,
			guildid: body.guildId,
			score: guildScore[0].score,
		});
	}

	// Re-Get userdata to now find out whether or not the user leveled up
	userData = await db.UserLevels.find({ raw: true, where: { userid: body.userId }});
	// Xp curve for experience is xp = 5x^2 + 40x + 55 where x is the level

	let newXp: number = userData.currentxp;
	let newLevel: number = userData.level;
	let levelXp = (5 * Math.pow(newLevel, 2)) + (40 * newLevel) + 55;
	let leveledUp = false;

	while (levelXp < newXp){
		leveledUp = true;
		/* console.log("user leveled up to level:" + (newLevel + 1)); */
		newXp = newXp - levelXp;

		// Increases level value by one and then updates levelXp again.
		// This is so on the off-chance that a user gets more than a level's worth of xp that it doesn't freak out.
		// It will add all of the levels to the user at the same time in this case;
		newLevel++;
		levelXp = (5 * Math.pow(newLevel, 2)) + (40 * newLevel) + 55;
	}

	await db.UserLevels.update({
		currentxp: newXp,
		level: newLevel,
	}, {
		where: { userid: body.userId },
	});

	res.contentType("application/json");
	const response: UserExperienceUpdate = {
		userid: body.userId,
		leveledUp: false,
		level: newLevel,
	};

	if (leveledUp){
		response.leveledUp = true;
	}

	res.status(200).send(response);
});

// Export the express.Router() instance to be used by server.ts
export const UserController: Router = router;