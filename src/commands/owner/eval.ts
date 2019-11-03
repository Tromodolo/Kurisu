import { Message } from "eris";
import util from "util";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";

export default class Eval extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "eval",
			description: "Evaluates code",
			usage: "info",
			aliases: ["evaluate"],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const before = Date.now();
			let retStr: string = "";
			try {
				let evald = eval(args.join(" "));
				evald = util.inspect(evald, { depth: 0 });

				if (evald && evald.length > 1800){
					evald = evald.substring(0, 1800);
				}
				const after = Date.now();
				retStr = "```javascript\n" +
					`Input: ${args.join(" ")}\n` +
					`Output: ${evald}\n` +
					`Time: ${(after - before)} ms\`\`\``;
			}
			catch (err) {
				const after = Date.now();

				retStr = "```javascript\n" +
					`Input: ${args.join(" ")}\n` +
					`Error: ${err}\n` +
					`Time: ${(after - before)} ms\`\`\``;
			}
			await message.channel.createMessage(retStr);
			return resolve();
		});
	}
}