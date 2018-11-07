/**
 * avatar.ts
 *
 * Gets avatar of another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import { generalConfig } from "../../config/";
import { Command } from "../../types";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import { getUserByMessage } from "../../util/Util";

const commandName: string = "avatar";
const aliases: string[] = ["ava", "pfp", "proflepicture"];
const description: string = "Gets avatar for a user";
const fullDescription: string = "Gets avatar for a user, or your own if unspecified";
const usage: string = "avatar [user]";
const requirements: string[] = [];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const user = getUserByMessage(message, args);
		const embed = new DiscordEmbed();

		embed.setTimestamp(new Date(Date.now()).toISOString());
		embed.setColor(parseInt(generalConfig.color));

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

const command = new Command(
	commandName,
	description,
	fullDescription,
	usage,
	aliases,
	requirements,
	deleteCommand,
	commandFunc,
);

export default command;
