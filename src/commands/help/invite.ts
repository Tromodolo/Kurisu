/**
 * invite.ts
 *
 * Gets link to invite bot to server
 *
 * Last Edit - February 15 2020 by Tromo
 */

import { Message } from "eris";
import moment from "moment";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

export default new KurisuCommand (
	{
		name: "invite",
		description: "Gets link to invite bot to server",
		usage: "Invite",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			const embed = new DiscordEmbed();

			embed.setColor(parseInt(config.bot.color));
			embed.setAuthor("Invite link:", bot.client.user.avatarURL, bot.client.user.avatarURL);
			embed.setDescription(`[Click here to invite bot](https://discordapp.com/oauth2/authorize?&client_id=${bot.client.user.id}&scope=bot&permissions=12659727)`);

			await message.channel.createMessage(embed.getEmbed());
			return resolve(null);
		});
	},
);
