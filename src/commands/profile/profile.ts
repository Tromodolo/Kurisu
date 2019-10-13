import { Message } from "eris";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage } from "../../utility/Util";
import { Bot } from "../../bot";

export default class Profile extends Command {
	constructor(){
		super();
		this.commandName = "profile";
		this.aliases = [];
		this.description = "Shows your profile";
		this.fullDescription = "Shows your profile";
		this.usage = "profile";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[], bot: Bot) {
		return new Promise(async (resolve) => {
			let user = message.member!;
			if (args.length > 0){
				const found = getUserByMessage(message, args);
				if (found){
					user = found;
				}
			}

			const dbUser = await bot.db.getOrCreateUser(user);

			const embed = new DiscordEmbed();
			embed.setColor(parseInt(config.bot.color));
			embed.setTitle("Profile");
			embed.setThumbnail(user.avatarURL);
			embed.addField("Name", user.username, true);
			embed.addField("Title", dbUser.profile.title ? `**${dbUser.profile.title}**` : "Wanderer", true);

			/* Everything about this is a confusing mess, don't ask */
			const level = getLevelFromExp(dbUser.experience.total);

			const expForNextLevel = getExpForLevel(level) - getExpForLevel(level - 1);
			const levelExp = expForNextLevel - (getExpForLevel(level) - dbUser.experience.total);

			embed.addField("Level", `**Lvl. ${level}** :star:\n${levelExp}/${expForNextLevel} xp`, true);
			embed.addField("Total Experience", `**${dbUser.experience.total}** XP`, true);
			embed.addField("Description", `${dbUser.profile.description}`);

			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}

// 50 * x ^ 2 = Y
// x ^ 2 = Y / 50
function getLevelFromExp(exp: number){
	return Math.floor(Math.sqrt(exp / 50)) + 1;
}

function getExpForLevel(level: number){
	return Math.floor(50 * Math.pow(level, 2));
}