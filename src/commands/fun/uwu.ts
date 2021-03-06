import { Message } from "eris";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";

export default new KurisuCommand (
	{
		name: "uwu",
		description: "Takes a sentence and makes it cursed",
		usage: "uwu {sentence}",
		aliases: [
			"owo",
			"curse",
			"kezspeak",
		],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			let content = args.join(" ");

			content = content.replace(/l/gi, "w");
			content = content.replace(/r/gi, "w");
			content = content.replace(/\sis\s/gi, " ish ");
			content = content.replace(/\?/gi, "? uwu");
			content = content.replace(/\!/gi, "! owo");
			content = content.replace(/\./gi, " :3");

			if (content.length > 0){
				await message.channel.createMessage(content);
			}
			return resolve(null);
		});
	},
);
