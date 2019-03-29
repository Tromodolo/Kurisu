/**
 * avatar.ts
 *
 * Gets avatar of another user
 *
 * Last Edit - March 29 2019 by Tromo
 */

import { Message } from "eris";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage } from "../../utility/Util";

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

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const user = getUserByMessage(message, args);
			const embed = new DiscordEmbed();

			embed.setTimestamp(new Date(Date.now()).toISOString());
			embed.setColor(parseInt(config.bot.color));

			if (!user) {
				return "User not found";
			}

			embed.setTitle(`Avatar for ${user.username}#${user.discriminator}`);

			let userAvatar = user.avatarURL.replace("jpg", "png");
			userAvatar = userAvatar.replace("?size=128", "?size=1024");

			embed.setUrl(userAvatar);
			embed.setImage(userAvatar);

			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}
