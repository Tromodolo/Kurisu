/**
 * hug.ts
 *
 * Hugs another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import fs from "fs";
import { bot } from "../../bot";
import * as config from "../../config.json";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import { getUserByMessage } from "../../util/Util";

const commandName: string = "hug";
const aliases: string[] = [];
const description: string = "Hugs someone";
const fullDescription: string = "Hugs someone or gets hugged if unspecified";
const usage: string = "hug [user]";
const requirements: object = {};
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
			embedMessage = `*Hugs* ${message.member.mention}`;
		}
		else{
			embedMessage = `${message.member.mention} *hugs* ${user.mention}`;
		}

		let fileNum = 1;
		fs.readdir("./data/hug", (err: Error, files: any) => {
			fileNum = files.length;

			const randomFile = Math.floor(Math.random() * fileNum);

			fs.readFile(`./data/hug/${randomFile}.gif`, (err2: Error, data: Buffer ) => {
				embed.setDescription(embedMessage);
				embed.setImage("attachment://hug.gif");
				bot.createMessage(message.channel.id, embed.getEmbed(), { file: data, name: "hug.gif" });
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