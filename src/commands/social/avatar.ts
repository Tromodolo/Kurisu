/**
 * avatar.ts
 *
 * Gets avatar of another user
 *
 * Last Edit - March 29 2019 by Tromo
 */

import { Message, GuildChannel } from "eris";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage } from "../../utility/Util";

import image2base64 from "image-to-base64";
import * as ColorThief from "colorthief";
import { Bot } from "../../bot";

export default class Avatar extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "avatar",
			description: "Gets avatar for user/server, or your own if unspecified",
			usage: "avatar {user}",
			aliases: ["ava", "pfp", "proflepicture"],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const user = getUserByMessage(message, args);
			const embed = new DiscordEmbed();

			embed.setTimestamp(new Date());

			if (args[0] && args[0].toLowerCase() === "server"){
				embed.setTitle(`Server Icon for ${(message.channel as GuildChannel).guild.name}`);

				let avatar = ((message.channel as GuildChannel).guild.iconURL || "").replace("jpg", "png");

				const base64 = "data:image/png;base64," + await image2base64(avatar.replace(".gif", ".png"));
				const mainColour = await ColorThief.getColor(base64);
				let hexColor = "";
				if (mainColour){
					hexColor = `0x${mainColour[0].toString(16)}${mainColour[1].toString(16)}${mainColour[2].toString(16)}`;
				}
				else{
					hexColor = config.bot.color;
				}
				embed.setColor(parseInt(hexColor));

				avatar = avatar.replace("?size=128", "?size=1024");

				embed.setUrl(avatar);
				embed.setImage(avatar);
			}
			else{
				if (!user) {
					return "User not found";
				}

				embed.setTitle(`Avatar for ${user.username}#${user.discriminator}`);

				let userAvatar = user.avatarURL.replace("jpg", "png");
				userAvatar = userAvatar.replace("?size=128", "?size=1024");

				const base64 = "data:image/png;base64," + await image2base64(userAvatar.replace(".gif", ".png"));
				const mainColour = await ColorThief.getColor(base64);
				let hexColor = "";
				if (mainColour){
					hexColor = `0x${mainColour[0].toString(16)}${mainColour[1].toString(16)}${mainColour[2].toString(16)}`;
				}
				else{
					hexColor = config.bot.color;
				}
				embed.setColor(parseInt(hexColor));

				embed.setUrl(userAvatar);
				embed.setImage(userAvatar);
			}


			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}
