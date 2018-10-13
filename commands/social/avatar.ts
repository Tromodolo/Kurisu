/**
 * avatar.js
 *
 * get the avatar of a user
 *
 * Last Edit - Oct 12, 2018 by Elias
 */

import { bot } from "../../bot";
import config from "../../config.json";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import Util from "../../util/Util";

const commandName: string = "test";
const aliases: string[] = ["ava", "pfp", "proflepicture"];
const description: string = "";
const fullDescription: string = "";
const usage: string = "";
const requirements: object = {};
const deleteCommand: boolean = false;

async function commandFunc(message: any, args: string[]) {
	return new Promise(async (resolve) => {
		const user = Util.getUserByMessage(message, args);
		const embed = new DiscordEmbed();

		embed.setTimestamp(new Date(Date.now()).toISOString());
		embed.setColor(config.color);

		if (!user) {
			return "User not found";
		}

		embed.setTitle(`Avatar for ${user.username}#${user.discriminator}`);

		let userAvatar = user.avatarURL.replace("jpg", "png");
		userAvatar = userAvatar.replace("?size=128", "?size=1024");

		embed.setUrl(userAvatar);
		embed.setImage(userAvatar);

		await bot.createMessage(message.channel.id, embed.getEmbed());
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
