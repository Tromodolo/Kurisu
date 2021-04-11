/**
 * hug.ts
 *
 * Hugs another user
 *
 * Last Edit - March 29 2019 by Tromo
 */

import { Message } from "eris";
import fs from "fs";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getUserByMessage } from "../../utility/Util";

export default new KurisuCommand (
	{
		name: "hug",
		description: "Hugs someone or gets hugged if unspecified",
		usage: "hug {user}",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if (!message.member){
				return resolve(null);
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
			fs.readdir("data/hug", (err: NodeJS.ErrnoException | null, files: any) => {
				if (err) {
					return reject(err.message);
				}
				fileNum = files.length;

				const randomFile = Math.floor(Math.random() * fileNum);

				fs.readFile(`data/hug/${randomFile}.gif`, (err2: NodeJS.ErrnoException | null, data: Buffer ) => {
					if (err2) {
						return reject(err2.message);
					}
					embed.setDescription(embedMessage);
					embed.setImage("attachment://hug.gif");
					message.channel.createMessage(embed.getEmbed(), { file: data, name: "hug.gif" });
					return resolve(null);
				});
			});
		});
	},
);
