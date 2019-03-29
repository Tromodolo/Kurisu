/**
 * user.ts
 *
 * Gets information about another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import moment from "moment";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage } from "../../utility/Util";

export default class User extends Command {
	constructor(){
		super();
		this.commandName = "user";
		this.aliases = ["whois"];
		this.description = "Gets information about a user";
		this.fullDescription = "Gets information about a user or yourself if unspecified";
		this.usage = "avatar [user]";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			let user = getUserByMessage(message, args);
			const embed = new DiscordEmbed();

			if (!message.member){
				return resolve();
			}

			if (!user){
				user = message.member;
			}

			let userAvatar = user.avatarURL.replace("jpg", "png");
			userAvatar = userAvatar.replace("?size=128", "?size=1024");
			embed.setThumbnail(userAvatar);

			embed.setAuthor(`${user.username}#${user.discriminator}`, "", `${userAvatar}`);

			embed.addField(
				"ID",
				user.id,
				false,
			);

			embed.addField(
				"Playing",
				user.game ? user.game.name : "Nothing",
				false,
			);

			embed.addField(
				"Status",
				user.status || "*unavailable*",
				true,
			);

			embed.addField(
				"Nickname",
				user.nick || "*unavailable*",
				true,
			);

			embed.addField(
				"Account Created",
				moment(user.createdAt).format("lll"),
				false,
			);
			embed.addField(
				"Join Date",
				moment(user.joinedAt).format("lll"),
				false,
			);

			message.channel.createMessage(embed.getEmbed());

			return resolve();
		});
	}
}