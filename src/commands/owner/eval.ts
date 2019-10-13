import { Message } from "eris";
import util from "util";
import Command from "../../models/Command";

export default class Eval extends Command {
	constructor(){
		super();
		this.commandName = "eval";
		this.aliases = [
			"evaluate",
		];
		this.description = "Evaluates code";
		this.fullDescription = "Evaluates code";
		this.usage = "eval 5+5";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[]) {
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