import Axios from "axios";
import { createCanvas, Image, registerFont } from "canvas";
import drawMultilineText from "canvas-multiline-text";
import { Message } from "eris";
import fs from "fs";
import path from "path";
import Command from "../../models/Command";

registerFont(path.join(__dirname, "../../../data/Comic Sans UT.ttf"), { family: "Sans" });

export default class Sans extends Command {
	constructor(){
		super();
		this.commandName = "sans";
		this.aliases = [];
		this.description = "Makes sans say something";
		this.fullDescription = "Makes sans say something";
		this.usage = "sans {message}";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			if (args.length < 1){
				message.channel.createMessage("You need to specify a message. :<");
				return resolve();
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

			return resolve();
		});
	}
}

function sendAvatarRequests(firstUrl: string, secondUrl: string) {
	return new Promise((resolve, reject) => {
		let firstFinished = false;

		const buffers: { first?: Buffer, second?: Buffer} = {};

		Axios.get(firstUrl, {
			responseType: "arraybuffer",
		}).then((data) => {
			if (firstFinished === false){
				firstFinished = true;
				buffers.first = Buffer.from(data.data);
			}
			else{
				buffers.first = Buffer.from(data.data);
				resolve(buffers);
			}
		});

		Axios.get(secondUrl, {
			responseType: "arraybuffer",
		}).then((data) => {
			if (firstFinished === false){
				firstFinished = true;
				buffers.second = Buffer.from(data.data);
			}
			else{
				buffers.second = Buffer.from(data.data);
				resolve(buffers);
			}
		});
	});
}