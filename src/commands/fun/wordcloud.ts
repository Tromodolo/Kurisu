import { Message, TextChannel } from "eris";
import { createCanvas, Canvas, registerFont } from "canvas";
import d3 from "d3-cloud";
import randomColor from "randomcolor";
import path from "path";

import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";

registerFont(path.join(__dirname, "../../../data/SambiLemon.ttf"), { family: "Sambi Lemon" });

export default class WordCloud extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "wordcloud",
			description: "Generates wordcloud from the last 50 messages",
			usage: "wordcloud",
			aliases: [
				"wc",
				"cloud",
			],
			requirements: [],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			let lastMessages = await message.channel.getMessages(100, message.id);
			// Remove bot messages
			lastMessages = (lastMessages as Array<Message<TextChannel>>).filter((m) => !m.member?.bot);

			let words: any[] = [];
			for (const msg of lastMessages){
				if (msg.content?.length > 0){
					const msgContent = msg.cleanContent?.toLowerCase()
					.replace(/[-_,.?!:*^@]/g, " ")
					.replace(/[\\\/\"\']/g, "").split(" ") ?? [];

					for (const word of msgContent){
						// Ignore words with less than 3 characters
						if (word.length < 3){
							continue;
						}
						else if (word.startsWith("http") || word.startsWith("https")){ // Filter out ordinary URLs
							continue;
						}

						const i = words.findIndex((x) => x[0] === word);
						if (i !== -1){
							words[i][1] += 1;
						}
						else {
							words.push([word, 1]);
						}
					}
				}
			}

			words.sort((a, b) => {
				return b[1] - a[1];
			});

			if (words.length > 50){
				words = words.splice(0, 50);
			}

			const baseSize = 160;
			const mostUsed = words[0][1];

			d3().size([1000, 1000])
			.canvas(() => new Canvas(1, 1))
			.words(words.map((x, i) => {
				let size = Math.round(x[1] / mostUsed * baseSize);

				return {
					text: x[0],
					size,
				};
			}))
			.padding(10)
			.rotate(() => Math.floor((Math.random() * 2)) * 90)
			.font("Sambi Lemon")
			.fontSize((d) => d.size)
			.on("end", async (wds) => {
				const canvas = createCanvas(1000, 1000);
				var ctx = canvas.getContext('2d');
				ctx.textAlign = 'center';

				for (const wd of wds) {
					ctx.font = `${wd.size}px ${wd.font}`;
					ctx.fillStyle = randomColor();

					ctx.translate(500 + wd.x, 500 + wd.y);
					ctx.rotate(wd.rotate * Math.PI / 180);
					ctx.fillText(wd.text, 0, 0);
					ctx.rotate((0 - wd.rotate) * Math.PI / 180);
					ctx.resetTransform();
				}

				await message.channel.createMessage("", {file: canvas.toBuffer(), name: "wordcloud.png"});
				return resolve();
			})
			.start();
		});
	}
}
