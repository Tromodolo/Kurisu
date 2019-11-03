import Axios from "axios";
import { createCanvas, Image, registerFont } from "canvas";
import drawMultilineText from "canvas-multiline-text";
import { Member, Message } from "eris";
import fs from "fs";
import moment from "moment";
import path from "path";
import seedrandom from "seedrandom";
import KurisuCommand from "../../models/Command";
import { getLoveUsers } from "../../utility/Util";
import { Bot } from "../../bot";

registerFont(path.join(__dirname, "../../../data/love/VCR_OSD_MONO_1.001.ttf"), { family: "VCR" });
registerFont(path.join(__dirname, "../../../data/deathnote/IndieFlower.ttf"), { family: "Indie Flower" });
registerFont(path.join(__dirname, "../../../data/deathnote/ShadowsIntoLight.ttf"), { family: "Shadows Into Light" });

export default class Love extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "love",
			description: "Love tests two people and generates image",
			usage: "love {First Person} {Second Person}",
			aliases: [
				"ship",
				"love",
				"match",
			],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const users: { first?: Member, second?: Member } = getLoveUsers(message, args);
			if (!(users.first && users.second)){
				await message.channel.createMessage("You need to specify two people.");
			}
			else{
				const firstAvatar = users.first.avatarURL.replace(".jpg", ".png");
				const secondAvatar = users.second.avatarURL.replace(".jpg", ".png");

				const canvas = createCanvas(400, 300);
				const ctx = canvas.getContext("2d");

				let firstUserValue = 0;
				let secondUservalue = 0;

				// Goes through both usernames and gets a number value for them both
				for (const char of users.first.username){
					firstUserValue += char.toLowerCase().charCodeAt(0);
				}
				for (const char of users.second.username){
					secondUservalue += char.toLowerCase().charCodeAt(0);
				}

				/*
				 * Generates a random generator using the seed of the two usernames values
				 * and the day of the year to make sure it changes daily
				 */
				const rng = seedrandom("" + firstUserValue + secondUservalue + moment(Date.now()).dayOfYear());
				const lovePower = Math.ceil(rng() * 100);

				let loveMessage = "";
				let boxSize = 40;

				// Checks the love power that was generated and sets the message accordingly
				if (lovePower <= 20){
					loveMessage = `${users.first.username} and ${users.second.username} don't seem to fit well together at all. 💔`;
				}
				else if (lovePower <= 40){
					loveMessage = `${users.first.username} and ${users.second.username} are not likely to work out.`;
				}
				else if (lovePower <= 60){
					loveMessage = `${users.first.username} and ${users.second.username} might have a chance together.`;
				}
				else if (lovePower <= 80){
					loveMessage = `${users.first.username} and ${users.second.username} fit well for each other.`;
				}
				else if (lovePower <= 100){
					loveMessage = `${users.first.username} and ${users.second.username} are perfect for each other! ❤`;
				}

				if ((users.first.username.length + users.second.username.length >= 64)){
					boxSize = 90;
				}
				if ((users.first.username.length + users.second.username.length >= 50)){
					boxSize = 60;
				}

				// loveSize is the size of the heart that gets drawn to the image
				const loveSize = lovePower * 0.6;

				// Draws background to image
				const bg = new Image();
				bg.src = fs.readFileSync(path.join(__dirname, "../../../data/love/LoveBg.jpg"));
				ctx.drawImage(bg, 0, 0, 400, 300);

				const firstAvatarFile = new Image();
				const secondAvatarFile = new Image();

				// Loads both user avatars as buffers and sets them to the Image objects
				const buffers: any = await sendAvatarRequests(firstAvatar, secondAvatar);
				firstAvatarFile.src = buffers.first;
				secondAvatarFile.src = buffers.second;

				// Draws all images and text to the image
				// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
				const heartFilled = new Image();
				heartFilled.src = fs.readFileSync(path.join(__dirname, `../../../data/love/HeartFull.png`));

				const heartBg = new Image();
				heartBg.src = fs.readFileSync(path.join(__dirname, `../../../data/love/HeartBg.png`));

				ctx.drawImage(bg, -100, -50, 500, 500);

				ctx.fillStyle = "rgba(22, 22, 22, 0.80)";
				ctx.fillRect(0, 185, canvas.width, boxSize + 10);

				ctx.fillStyle = "rgba(22, 22, 22, 0.80)";
				ctx.fillRect(0, 55, canvas.width, 95);

				ctx.fillStyle = "#cecece";
				ctx.fillRect(43, 58, 89, 89);
				ctx.fillRect(268, 58, 89, 89);

				ctx.drawImage(firstAvatarFile, 45, 60, 85, 85);
				ctx.drawImage(secondAvatarFile, 270, 60, 85, 85);

				ctx.drawImage(heartBg, 170, 55, 60, 60);
				ctx.drawImage(heartFilled, 200 - (loveSize / 2), 85 - (loveSize / 2), loveSize, loveSize);

				ctx.fillStyle = "#cecece";

				ctx.font = "32px VCR";
				ctx.textAlign = "center";
				ctx.fillText(`${lovePower}%`, 200, 145);

				ctx.textAlign = "left";

				// Uses drawMultilineText to print out the different love prediction messages
				const fontSizeUsed = drawMultilineText(
					ctx,
					loveMessage,
					{
						rect: {
							x: 30,
							y: 190,
							width: canvas.width - 60,
							height: boxSize,
						},
						font: "VCR",
						verbose: false,
						lineHeight: 1.4,
						minFontSize: 16,
						maxFontSize: 18,
					},
				);

				// Converts canvas to buffer and sends it to the response
				const buffer = canvas.toBuffer();

				await message.channel.createMessage("", { file: buffer, name: "love.png"});

			}
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