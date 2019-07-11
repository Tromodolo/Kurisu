import { Message, Client } from "eris";
import Command from "../../models/Command";
import { DatabaseHandler } from "../../handlers";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

import * as config from "../../config";

export default class Achievements extends Command {
	constructor(){
		super();
		this.commandName = "achievements";
		this.aliases = [];
		this.description = "Show list of achievements";
		this.fullDescription = "Show list of achievements";
		this.usage = "achievements";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[], db: DatabaseHandler, bot: Client) {
		return new Promise(async (resolve) => {
			const user = await db.getOrCreateUser(message.member!);
			const earned = user.earnedAchievements;

			let achievements = await db.achievementRepo.find({
				where: {
					hidden: false,
				},
			});

			achievements = achievements.filter((y) => !earned.map((x) => x.id).includes(y.id));

			const embed = new DiscordEmbed();
			embed.setAuthor("List of Achievements:", "", bot.user.avatarURL);
			embed.setColor(parseInt(config.default.bot.color));

			let embedDesc = `:star2: **Earned Achievements:**`;
			for (const ach of earned){
				embedDesc += `
- **${ach.achievement.name}**
   _${ach.achievement.showDescription ? ach.achievement.description : "Unlock requirement hidden"}_

`;
			}

			embedDesc += `:question: **Not Earned Achievements:**`;
			for (const ach of achievements){
				embedDesc += `
- **${ach.name}**
   _${ach.showDescription ? ach.description : "Unlock requirement hidden"}_
`;
			}

			embed.setDescription(embedDesc);

			message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}