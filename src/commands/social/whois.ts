/**
 * user.ts
 *
 * Gets information about another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import moment from "moment";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage, getPrimaryColorFromImageUrl } from "../../utility/Util";
import * as ColorThief from "colorthief";
import image2base64 from "image-to-base64";
import config from "../../config";
import { Bot } from "../../bot";

export default class WhoIs extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "user",
			description: "Gets information about a user, or yourself if unspecified",
			usage: "user {user}",
			aliases: ["whois"],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			let user = getUserByMessage(message, args);
			const embed = new DiscordEmbed();

			if (!message.member){
				return resolve();
			}

			if (!user){
				user = message.member;
			}

			let userAvatar = user.avatarURL;
			const color = await getPrimaryColorFromImageUrl(userAvatar?.replace(".gif", ".png"));
			embed.setColor(color);

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