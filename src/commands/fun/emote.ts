import { Message } from "eris";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { Bot } from "../../bot";

export default class Emote extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "emote",
			description: "Shows full image of emote, and displays general information about it.",
			usage: "emote :OhISee:",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (!args[0]){
				return reject("You need to specify an emote");
			}

			// Save potential emote to a string variable
			const emoteArgs: string = args[0];
			// Regex that matches the emote markup of discord <:name:id> or <a:name:id> if animated
			const emoteRegex: RegExp = /<(a?):(.*?):(\d.*?[0-9])>/i;

			const result: RegExpMatchArray|null = emoteArgs.match(emoteRegex);
			let animated: string = "False";

			if (!result){
				return reject(":exclamation: That's not a valid emote.");
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
				embed.setColor(parseInt(config.bot.color));
				embed.addField("Name", result[2], true);
				embed.addField("ID", result[3], true);
				embed.addField("Animated", animated, true);
				embed.addField("Url", `[Here](${url})`, true);
				embed.setThumbnail(url);

				await message.channel.createMessage(embed.getEmbed());
			}

			return resolve();
		});
	}
}