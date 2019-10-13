/**
 * hug.ts
 *
 * Hugs another user
 *
 * Last Edit - March 29 2019 by Tromo
 */

import { Message } from "eris";
import fs from "fs";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage } from "../../utility/Util";

export default class Hug extends Command {
	constructor(){
		super();
		this.commandName = "hug";
		this.aliases = [];
		this.description = "Hugs someone";
		this.fullDescription = "Hugs someone or gets hugged if unspecified";
		this.usage = "hug [user]";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			if (!message.member){
				return resolve();
			}

			const embed = new DiscordEmbed();
			const user = getUserByMessage(message, args);
			let embedMessage = "";

			embed.setColor(parseInt(config.bot.color));

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
					message.channel.createMessage(embed.getEmbed(), { file: data, name: "hug.gif" });
				});
			});
			return resolve();
		});
	}
}