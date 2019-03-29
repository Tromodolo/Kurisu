import { Message } from "eris";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

export default class Emote extends Command {
	constructor(){
		super();
		this.commandName = "emote";
		this.aliases = [];
		this.description = "Shows full image of emote";
		this.fullDescription = "Shows full image of emote, and displays general information about it.";
		this.usage = "emote :OhISee:";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			if (!args[0]){
				await message.channel.createMessage("You need to specify an emote");
				return resolve();
			}

			// Save potential emote to a string variable
			const emoteArgs: string = args[0];
			// Regex that matches the emote markup of discord <:name:id> or <a:name:id> if animated
			const emoteRegex: RegExp = /<(a?):(.*?):(\d.*?[0-9])>/i;

			const result: RegExpMatchArray|null = emoteArgs.match(emoteRegex);
			let animated: string = "False";

			if (!result){
				await message.channel.createMessage(":exclamation: That's not a valid emote.");
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