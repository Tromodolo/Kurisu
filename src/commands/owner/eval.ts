import { Message } from "eris";
import util from "util";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import { getPrimaryColorFromImageUrl } from "../../utility/Util";

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

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
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

				const authorImg = "https://cdn.discordapp.com/emojis/587566059855282196.gif?v=1";

				const embed = new DiscordEmbed();
				embed.setAuthor("Eval Results", undefined, authorImg);

				const color = await getPrimaryColorFromImageUrl(this.bot.client.user.avatarURL);

				embed.setColor(color);
				embed.setDescription(retStr);

				await message.channel.createMessage(embed.getEmbed());
				return resolve();
			}
			catch (err) {
				const after = Date.now();

				return reject("```javascript\n" +
					`Input: ${args.join(" ")}\n` +
					`Error: ${err}\n` +
					`Time: ${(after - before)} ms\`\`\``);
			}
		});
	}
}