import { Message } from "eris";
import { bot } from "../../bot";
import * as config from "../../config.json";
import { DiscordEmbed } from "../../util/DiscordEmbed";

const commandName: string = "emote";
const aliases: string[] = [];
const description: string = "Shows full image of emote";
const fullDescription: string = "Shows full image of emote, and displays general information about it.";
const usage: string = "emote :OhISee:";

// const requirements: new Object();
const requirements: object = {};
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		if (!args[0]){
			await bot.createMessage(message.channel.id, "You need to specify an emote");
			return resolve();
		}

		// Save potential emote to a string variable
		const emoteArgs: string = args[0];
		// Regex that matches the emote markup of discord <:name:id> or <a:name:id> if animated
		const emoteRegex: RegExp = /<(a?):(.*?):(\d.*?[0-9])>/i;

		const result: RegExpMatchArray|null = emoteArgs.match(emoteRegex);
		let animated: string = "False";

		if (!result){
			await bot.createMessage(message.channel.id, ":exclamation: That's not a valid emote.");
		}
		else {
			// First check of regex
			if (result[1] === "a"){
				animated = "True";
			}

			// Inserts id of emote into url
			let url = `https://cdn.discordapp.com/emojis/${result[3]}`;

			if (animated === "True"){
				url += ".gif";
			}
			else {
				url += ".png";
			}

			const embed = new DiscordEmbed();
			embed.setColor(parseInt(config.color));
			embed.addField("Name", result[2], true);
			embed.addField("ID", result[3], true);
			embed.addField("Animated", animated, true);
			embed.addField("Url", `[Here](${url})`, true);
			embed.setThumbnail(url);

			await bot.createMessage(message.channel.id, embed.getEmbed());
		}

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
