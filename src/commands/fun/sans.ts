import { createCanvas, Image, registerFont } from "canvas";
import drawMultilineText from "canvas-multiline-text";
import { Message } from "eris";
import fs from "fs";
import path from "path";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";

registerFont(path.join(__dirname, "../../../data/Comic Sans UT.ttf"), { family: "Sans" });

export default new KurisuCommand (
	{
		name: "sans",
		description: "Makes sans say something",
		usage: "sans {message}",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1){
				return reject("You need to specify a message. :<");
			}

			const canvas = createCanvas(578, 152);
			const ctx = canvas.getContext("2d");

			const bg = new Image();
			bg.src = fs.readFileSync(path.join(__dirname, "../../../data/sans.png"));
			ctx.drawImage(bg, 0, 0, 578, 152);

			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "left";

			// Uses drawMultilineText to print out the different love prediction messages
			const fontSizeUsed = drawMultilineText(
				ctx,
				args.join(" "),
				{
					rect: {
						x: 170,
						y: 21,
						width: 400,
						height: 118,
					},
					font: "Sans",
					verbose: false,
					lineHeight: 1.4,
					minFontSize: 27,
					maxFontSize: 27,
				},
			);

			// Converts canvas to buffer and sends it to the response
			const buffer = canvas.toBuffer();

			await message.channel.createMessage("", { file: buffer, name: "sans.png"});

			return resolve(null);
		});
	},
);
