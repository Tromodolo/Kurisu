import axios from "axios";
import { createCanvas, Image, registerFont } from "canvas";
import { Message } from "eris";
import fs from "fs";
import path from "path";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";
import { getPrimaryColorHexFromImageUrl, getUserByMessage } from "../../utility/Util";

registerFont(path.join(__dirname, "../../../data/Nunito-Bold.ttf"), { family: "Nunito", weight: "bold" });

export default new KurisuCommand (
	{
		name: "profile",
		description: "Shows your profile",
		usage: "profile",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			let user = message.member!;

			if (args.length > 0){
				const found = getUserByMessage(message, args);
				if (found){
					user = found;
				}
			}

			if (user.bot){
				return reject({title: "Could not view profile", message: ":no_good: Bots do not have profiles."});
			}

			const dbUser = await bot.db.getOrCreateUser(user);
			const primaryColour = await getPrimaryColorHexFromImageUrl(user.avatarURL);

			const canvas = createCanvas(500, 430);
			const ctx = canvas.getContext("2d");

			// Draws background to image
			const bg = new Image();
			bg.src = fs.readFileSync(path.join(__dirname, "../../../data/profile.png"));
			ctx.drawImage(bg, 0, 0, 500, 430);

			try{
				const avatarUrl = user.avatarURL;
				const data = await axios.get(avatarUrl, {
					responseType: "arraybuffer",
				});

				// Draws background to image
				const avatar = new Image();
				avatar.src = Buffer.from(data.data);
				ctx.drawImage(avatar, 16, 16, 100, 100);
			}
			catch {
				console.error("Failed to draw user avatar in profile command.");
			}

			// Render name and title
			ctx.font = "bold 21px Nunito";
			ctx.fillStyle = "rgba(229, 229, 229, 1)";
			ctx.textBaseline = "hanging";
			const nameLength = ctx.measureText(user.username);
			ctx.fillText(user.username, 130, 24);

			ctx.font = "bold 12px Nunito";
			ctx.fillStyle = "rgba(229, 229, 229, 0.7)";
			ctx.fillText("#" + user.discriminator, 130 + nameLength.width, 33);

			ctx.font = "bold 16px Nunito";
			ctx.fillStyle = "#CDCDCD";
			ctx.fillText(dbUser?.profile?.title ?? "Wanderer", 130, 50, 350);

			// Draw accents
			ctx.fillStyle = primaryColour;
			ctx.fillRect(0, 129, 500, 2);

			// Render parts of stats
			let offset = 0;
			renderExp(ctx, dbUser.experience?.total ?? 0, primaryColour, offset);
			offset += 32;
			if (dbUser?.statistics?.totalMessages) {
				renderStat(ctx, "Time spent", convertMinutes(dbUser?.statistics?.totalMessages), offset);
				offset += 32;
			}
			if (dbUser?.statistics?.totalMessages){
				renderStat(ctx, "Total messages", dbUser?.statistics?.totalMessages?.toString(), offset);
				offset += 32;
			}
			if (dbUser?.statistics?.commandsUsed){
				renderStat(ctx, "Commands used", dbUser?.statistics?.commandsUsed?.toString(), offset);
				offset += 32;
			}

			// Render description
			ctx.font = "bold 14px Nunito";
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText("Description", 10, 140 + offset);

			ctx.fillStyle = "#525252";
			ctx.fillRect(10, 160 + offset, 70, 1);

			ctx.fillStyle = "#CDCDCD";
			ctx.font = "bold 14px Nunito";
			renderMultilineText(ctx, dbUser?.profile?.description ?? "", 10, 170 + offset, 14, 480);

			// Converts canvas to buffer and sends it to the response
			const buffer = canvas.toBuffer();
			await message.channel.createMessage("", { file: buffer, name: "profile.png"});
			return resolve(null);
		});
	},
);

function convertMinutes(input_min: number){
	const minutes = input_min % 60;
	let hours = 0;
	let days = 0;
	if (input_min > 60){
		days = Math.floor(input_min / (60 * 24));
		hours = Math.floor((input_min / 60) % 24);
	}

	let output = "~";
	if (days > 0){
		output += `${days}d `;
	}
	if (hours > 0){
		output += `${hours}h `;
	}
	output += `${minutes}m`;
	return output;
}

function renderMultilineText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, maxWidth: number) {
	const words = text.split(" ");
	const lines: string[] = [];
	let line = "";
	for (const word of words) {
		const measured = ctx.measureText(line + word);
		if (measured.width < maxWidth){
			line += `${word} `;
		}
		else {
			lines.push(line);
			line = `${word} `;
		}
	}
	lines.push(line);

	let index = 0;
	for (const l of lines){
		ctx.fillText(l, x, y + index * (fontSize * 1.3));
		index++;
	}
}

function renderStat(ctx: CanvasRenderingContext2D, statName: string, statValue: string, offset: number = 0){
	ctx.fillStyle = "#3B3C3D";
	ctx.fillRect(0, 131 + offset, 500, 31);
	ctx.fillStyle = "#525252";
	ctx.fillRect(0, 162 + offset, 500, 1);

	ctx.textBaseline = "hanging";
	ctx.font = "bold 16px Nunito";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "right";
	ctx.fillText(statName, 145, 135 + offset);

	ctx.textAlign = "left";
	ctx.fillStyle = "#CDCDCD";
	ctx.font = "bold 14px Nunito";
	ctx.fillText(statValue, 158, 137 + offset);
}

function renderExp(ctx: CanvasRenderingContext2D, exp: number = 0, barColor: string, offset: number = 0){
	ctx.fillStyle = "#3B3C3D";
	ctx.fillRect(0, 131 + offset, 500, 31);
	ctx.fillStyle = "#525252";
	ctx.fillRect(0, 162 + offset, 500, 1);

	ctx.textBaseline = "hanging";
	ctx.font = "bold 16px Nunito";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "right";
	ctx.fillText("Experience", 145, 135 + offset);

	const level = getLevelFromExp(exp);
	const currXp = getExpForLevel(level);
	const prevXp = getExpForLevel(level - 1);

	const xpIntolevel = exp - prevXp;
	const xpForLevel = currXp - prevXp;

	ctx.textAlign = "left";
	ctx.fillStyle = "#CDCDCD";
	ctx.font = "bold 14px Nunito";
	ctx.fillText(`Lv. ${level}`, 158, 137 + offset);
	ctx.fillText(`${xpIntolevel}/${xpForLevel} xp`, 405, 137 + offset);

	const xpBarLength = 190;
	const xpBarHeight = 8;

	ctx.fillStyle = "#4E4F50";
	ctx.fillRect(205, 142 + offset, xpBarLength, xpBarHeight);

	const xpPercent = xpIntolevel / xpForLevel * 100;
	const pixelsPerPercent = xpBarLength / 100;

	ctx.fillStyle = barColor;
	ctx.fillRect(205, 142 + offset, xpPercent * pixelsPerPercent, xpBarHeight);
}

// 50 * x ^ 2 = Y
// x ^ 2 = Y / 50
function getLevelFromExp(exp: number){
	return Math.floor(Math.sqrt(exp / 50)) + 1;
}

function getExpForLevel(level: number){
	return Math.floor(50 * Math.pow(level, 2));
}
