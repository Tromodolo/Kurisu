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
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

export default class Info extends Command {
	constructor(){
		super();
		this.commandName = "info";
		this.aliases = [];
		this.description = "Show information about the bot";
		this.fullDescription = "Show information about the bot";
		this.usage = "info]";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[], bot: Bot) {
		return new Promise(async (resolve) => {
			const embed = new DiscordEmbed();

			embed.setColor(parseInt(config.bot.color));
			embed.setAuthor("Bot information:", bot.client.user.avatarURL, bot.client.user.avatarURL);

			embed.addField("Devs", config.bot.developers.length > 0 ? config.bot.developers.map((x) => x.name).join(",\n") : "Uh Oh I don't know how this happened", true);
			embed.addField("Node.js Version", process.version, true);
			embed.addField("Discord Library", config.bot.libraryVersion, true);

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
			embed.addField("Shards", `${bot.client.shards.size}`, true);
			embed.addField("Server Count", `${bot.client.guilds.size}`, true);
			embed.addField("User Count", `${bot.client.users.size}`, true);
			/* embed.addField("Invite Link", `[Link](${config.bot.inviteLink})`, true); */

			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}