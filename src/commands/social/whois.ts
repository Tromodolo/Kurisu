/**
 * user.ts
 *
 * Gets information about another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import moment from "moment";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getPrimaryColorFromImageUrl, getUserByMessage } from "../../utility/Util";

export default new KurisuCommand (
	{
		name: "user",
		description: "Gets information about a user, or yourself if unspecified",
		usage: "user {user}",
		aliases: ["whois"],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			let user = getUserByMessage(message, args);
			const embed = new DiscordEmbed();

			if (!message.member){
				return resolve(null);
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
				user.game?.name ?? "Nothing",
				false,
			);

			embed.addField(
				"Status",
				user.status ?? "*unavailable*",
				true,
			);

			embed.addField(
				"Nickname",
				user.nick ?? "*unavailable*",
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

			return resolve(null);
		});
	},
);
