/**
 * pets.ts
 *
 * Pets another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import fs from "fs";
import { bot } from "../../bot";
import * as config from "../../config.json";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import { getUserByMessage } from "../../util/Util";

const commandName: string = "pet";
const aliases: string[] = [];
const description: string = "Pets someone";
const fullDescription: string = "Pets someone or gets petted if unspecified";
const usage: string = "pet [user]";
const requirements: string[] = [];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		if (!message.member){
			return resolve();
		}

		const embed = new DiscordEmbed();
		const user = getUserByMessage(message, args);
		let embedMessage = "";

		embed.setColor(parseInt(config.color));

		if (!user || user.id === message.member.id){
			embedMessage = `*Pets* ${message.member.mention}`;
		}
		else{
			embedMessage = `${message.member.mention} *pets* ${user.mention}`;
		}

		let fileNum = 1;
		fs.readdir("./data/pet", (err: Error, files: any) => {
			fileNum = files.length;

			const randomFile = Math.floor(Math.random() * fileNum);

			fs.readFile(`./data/pet/${randomFile}.gif`, (err2: Error, data: Buffer ) => {
				embed.setDescription(embedMessage);
				embed.setImage("attachment://pet.gif");
				bot.createMessage(message.channel.id, embed.getEmbed(), { file: data, name: "pet.gif" });
			});
		});
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
