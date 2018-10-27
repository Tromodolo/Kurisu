/**
 * info.ts
 *
 * Gets information about the bot
 *
 * Last Edit - Oct 19, 2018 by Tromo
 */

import { Message } from "eris";
import moment from "moment";
import { bot } from "../../bot";
import * as config from "../../config.json";
import { Command } from "../../types";
import { DiscordEmbed } from "../../util/DiscordEmbed";

const commandName: string = "info";
const aliases: string[] = [];
const description: string = "Show information about the bot";
const fullDescription: string = "Show information about the bot";
const usage: string = "info";
const requirements: string[] = [
];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const embed = new DiscordEmbed();

		embed.setColor(parseInt(config.color));
		embed.setAuthor("Bot information:", bot.user.avatarURL, bot.user.avatarURL);

		embed.addField("Devs", config.developers.length > 0 ? config.developers.join(",\n") : "Uh Oh I don't know how this happened", true);
		embed.addField("Node.js Version", process.version, true);
		embed.addField("Discord Library", config.libraryVersion, true);

		// Process.uptime returns in seconds, so here i multiply by 1000 to get miliseconds
		const timeNow = Date.now();
		const timeAgo = timeNow - (process.uptime() * 1000);
		const ms = moment(timeNow).diff(moment(timeAgo));
		const duration = moment.duration(ms);
		const formattedTime = Math.floor(duration.asHours()) + moment.utc(ms).format(":mm:ss");
		embed.addField("Uptime", `${formattedTime}`, true);

		// Gets heap of memory used in bytes, so divide by 1024 two times to get MB
		const memHeap = process.memoryUsage().heapUsed;
		const megabytes = Math.round(memHeap / 1024 / 1024);

		embed.addField("Memory usage", `${megabytes}MB`, true);
		embed.addField("Shards", `${bot.shards.size}`, true);
		embed.addField("Server Count", `${bot.guilds.size}`, true);
		embed.addField("User Count", `${bot.users.size}`, true);
		embed.addField("Invite Link", `[Link](${config.inviteLink})`, true);

		await bot.createMessage(message.channel.id, embed.getEmbed());
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
