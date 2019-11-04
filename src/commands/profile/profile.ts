import { Message } from "eris";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage, getPrimaryColorFromImageUrl } from "../../utility/Util";

import image2base64 from "image-to-base64";
import * as ColorThief from "colorthief";

export default class Profile extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "profile",
			description: "Shows your profile",
			usage: "profile",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			let user = message.member!;
			if (args.length > 0){
				const found = getUserByMessage(message, args);
				if (found){
					user = found;
				}
			}

			if (user.bot){
				message.channel.createMessage(":no_good: Bots do not have profiles.");
				return;
			}

			const dbUser = await this.bot.db.getOrCreateUser(user);

			const embed = new DiscordEmbed();

			const color = await getPrimaryColorFromImageUrl(user.avatarURL?.replace(".gif", ".png"));
			embed.setColor(color);

			embed.setTitle("Profile");
			embed.setThumbnail(user.avatarURL);
			embed.addField("Name", user.username, true);
			embed.addField("Title", `**${dbUser?.profile?.title ?? "Wanderer"}**`, true);

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