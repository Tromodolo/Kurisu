import { Message } from "eris";
import util from "util";
import { bot } from "../../bot";
import { Command } from "../../types";

const commandName: string = "eval";
const aliases: string[] = [
	"evaluate",
];
const description: string = "Evaluates code";
const fullDescription: string = "Evaluates code";
const usage: string = "eval 5+5";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const client = bot;
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
