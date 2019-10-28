/**
 * avatar.ts
 *
 * Gets avatar of another user
 *
 * Last Edit - March 29 2019 by Tromo
 */

import { Message, GuildChannel } from "eris";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage } from "../../utility/Util";

import image2base64 from "image-to-base64";
import * as ColorThief from "colorthief";

export default class Avatar extends Command {
	constructor(){
		super();
		this.commandName = "avatar";
		this.aliases = ["ava", "pfp", "proflepicture"];
		this.description = "Gets avatar for a user";
		this.fullDescription = "Gets avatar for a user, or your own if unspecified";
		this.usage = "avatar [user]";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			let user = getUserByMessage(message, args);
			const embed = new DiscordEmbed();

			embed.setTimestamp(new Date(Date.now()).toISOString());

			if (args[0] && args[0].toLowerCase() === "server"){
				embed.setTitle(`Avatar for ${(message.channel as GuildChannel).guild.name}`);

				let avatar = ((message.channel as GuildChannel).guild.iconURL || "").replace("jpg", "png");

				const base64 = "data:image/png;base64," + await image2base64(avatar);
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

				embed.setTitle(`Server Icon for ${user.username}#${user.discriminator}`);

				let userAvatar = user.avatarURL.replace("jpg", "png");
				userAvatar = userAvatar.replace("?size=128", "?size=1024");

				const base64 = "data:image/png;base64," + await image2base64(userAvatar);
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
