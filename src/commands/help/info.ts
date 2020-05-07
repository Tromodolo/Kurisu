/**
 * info.ts
 *
 * Gets information about the bot
 *
 * Last Edit - March 29 2019 by Tromo
 */

import { Message } from "eris";
import moment from "moment";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

import childProcess from "child_process";

export default class Info extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "info",
			description: "Show information about the bot",
			usage: "info",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			const embed = new DiscordEmbed();

			embed.setColor(parseInt(config.bot.color));
			embed.setAuthor("Bot information:", this.bot.client.user.avatarURL, this.bot.client.user.avatarURL);

			embed.addField("Devs", config.bot.developers.length > 0 ? config.bot.developers.map((x) => x.name).join(",\n") : "Uh Oh I don't know how this happened", true);
			embed.addField("Node.js Version", process.version, true);
			embed.addField("Discord Library", config.bot.libraryVersion, true);

			const gitHash = childProcess.execSync("git rev-parse HEAD");
			if (gitHash){
				embed.addField("Git Commit", gitHash.toString("utf8").substr(0, 7), true);
			}

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
			embed.addField("Shards", `${this.bot.client.shards.size}`, true);
			embed.addField("Server Count", `${this.bot.client.guilds.size}`, true);
			embed.addField("User Count", `${this.bot.client.users.size}`, true);
			/* embed.addField("Invite Link", `[Link](${config.bot.inviteLink})`, true); */

			embed.setFooter("https://github.com/Tromodolo/Kurisu");

			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}