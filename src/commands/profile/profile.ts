import { Message } from "eris";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { DatabaseHandler } from "../../handlers";
import { User } from "../../database/models/User";
import { getUserByMessage } from "../../utility/Util";

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

	public commandFunc(message: Message, args: string[], db: DatabaseHandler) {
		return new Promise(async (resolve) => {
			let user = message.member!;
			if (args.length > 0){
				const found = getUserByMessage(message, args);
				if (found){
					user = found;
				}
			}

			const dbUser = await db.getOrCreateUser(user);

			const embed = new DiscordEmbed();
			embed.setColor(parseInt(config.bot.color));
			embed.setTitle("Profile");
			embed.setThumbnail(user.avatarURL);
			embed.addField("Name", user.username, true);
			embed.addField("Title", dbUser.profile.equippedAchievement ? `**${dbUser.profile.equippedAchievement.achievement.title}**` : "_No equipped title_", true);

			embed.addField("Level", `:star: ${getLevelFromExp(dbUser.experience.total)}`, true);
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
