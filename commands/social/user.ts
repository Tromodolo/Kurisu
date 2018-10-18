/**
 * user.ts
 *
 * Gets information about another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import moment from "moment";
import { bot } from "../../bot";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import { getUserByMessage } from "../../util/Util";

const commandName: string = "user";
const aliases: string[] = [
	"whois",
];
const description: string = "Gets information about a user";
const fullDescription: string = "Gets information about a user or yourself if unspecified";
const usage: string = "avatar [user]";
const requirements: string[] = [];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
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

		bot.createMessage(message.channel.id, embed.getEmbed());

		return resolve();
	});
}

export {
	aliases,
	description,
	fullDescription,
	commandFunc,
	commandName,
	usage,
	requirements,
	deleteCommand,
};
