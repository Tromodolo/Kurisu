import { Message } from "eris";
import { bot } from "../../bot";
import Command from "../../models/Command";

export default class PleaseHelpMe extends Command {
	constructor(){
		super();
		this.commandName = "uwu";
		this.aliases = [
			"owo",
			"curse",
			"kezspeak",
		];
		this.description = "Takes a sentence and makes it cursed";
		this.fullDescription = "Takes a sentence and makes it cursed";
		this.usage = "uwu [sentence]";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			let content = args.join(" ");

			content = content.replace(/l/gi, "w");
			content = content.replace(/r/gi, "w");
			content = content.replace(/\sis\s/gi, "ish");
			content = content.replace(/\?/gi, "? uwu");
			content = content.replace(/\!/gi, "! owo");
			content = content.replace(/\./gi, " :3");

			if (content.length > 0){
				await message.channel.createMessage(content);
			}
			return resolve();
		});
	}
}
