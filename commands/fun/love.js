var exports = module.exports = {};

const client = require("../../bot.js").client,
	  fs = require("fs"),
	  drawMultilineText = require('canvas-multiline-text'),
	  getLoveUsers = require("../../utility/Utility").getLoveUsers,
	  seedrandom = require('seedrandom'),
	  moment = require("moment"),
	  download = require("image-downloader");
const { createCanvas, loadImage, Image, registerFont } = require('canvas');
registerFont("./data/Love/VCR_OSD_MONO_1.001.ttf", { family: 'VCR' });

exports.aliases = [
	"ship"
];
exports.description = "Gets compatibility between people";
exports.fullDescription = "Gets love compatibility between two specified people";
exports.usage = "love person1 person2";
exports.requirements = {

}

exports.function = async (msg, args) => {
	let users = getLoveUsers(msg, args);

	if(!users.first){
		return "Please specify two people";
	}
	else if(!users.second){
		return "Please specify a second person";
	}
	
	await download.image({
		url: `${users.first.user.dynamicAvatarURL("png", "1024")}`,
		dest: `./data/tmp/avatars/${users.first.id}.png`        // Save to /path/to/dest/photo.jpg
	});
	
	await download.image({
		url: `${users.second.user.dynamicAvatarURL("png", "1024")}`,
		dest: `./data/tmp/avatars/${users.second.id}.png`        // Save to /path/to/dest/photo.jpg
	});

	let firstUserValue = 0, secondUservalue = 0;

	for(let i in users.first.username){
		firstUserValue += parseInt(users.first.username.toLowerCase().charCodeAt(i));
	}
	for(let i in users.second.username){
		secondUservalue += parseInt(users.second.username.toLowerCase().charCodeAt(i));
	}

	var rng = seedrandom(firstUserValue + secondUservalue + moment(Date.now()).dayOfYear());

	let lovePower = Math.ceil(rng() * 100);
	let loveMessage = "";
	let boxSize = 40;

	if((users.first.username.length + users.second.username.length >= 64)){
		boxSize = 90;
	}
	if((users.first.username.length + users.second.username.length >= 50)){
		boxSize = 60;
	}

	if(lovePower <= 20) loveMessage = `${users.first.username} and ${users.second.username} don't seem to fit well together at all. 💔`
	else if(lovePower <= 40) loveMessage = `${users.first.username} and ${users.second.username} are not likely to work out.`
	else if(lovePower <= 60) loveMessage = `${users.first.username} and ${users.second.username} might have a chance together.`
	else if(lovePower <= 80) loveMessage = `${users.first.username} and ${users.second.username} fit well for each other.`
	else if(lovePower <= 100) loveMessage = `${users.first.username} and ${users.second.username} are perfect for each other! ❤`

	let loveSize = lovePower * 0.6;

	const canvas = createCanvas(400, 300);
	const ctx = canvas.getContext('2d');

	let Bg = new Image();
	Bg.src = fs.readFileSync(`./data/Love/LoveBg.jpg`);

	let firstAvatar = new Image();
	firstAvatar.src = fs.readFileSync(`./data/tmp/avatars/${users.first.id}.png`);
	let secondAvatar = new Image();
	secondAvatar.src = fs.readFileSync(`./data/tmp/avatars/${users.second.id}.png`);

	let heartFilled = new Image();
	heartFilled.src = fs.readFileSync(`./data/Love/HeartFull.png`);
	let heartBg = new Image();
	heartBg.src = fs.readFileSync(`./data/Love/HeartBg.png`);

	ctx.drawImage(Bg, -100, -50, 500, 500);

	ctx.fillStyle = "rgba(22, 22, 22, 0.80)";
	ctx.fillRect(0, 185, canvas.width, boxSize + 10);

	ctx.fillStyle = "rgba(22, 22, 22, 0.80)";
	ctx.fillRect(0, 55, canvas.width, 95);

	ctx.fillStyle = "#cecece";
	ctx.fillRect(43, 58, 89, 89);
	ctx.fillRect(268, 58, 89, 89);

	ctx.drawImage(firstAvatar, 45, 60, 85, 85);
	ctx.drawImage(secondAvatar, 270, 60, 85, 85);
	
	ctx.drawImage(heartBg, 170, 55, 60, 60);
	ctx.drawImage(heartFilled, 200 - (loveSize / 2), 85 - (loveSize / 2), loveSize, loveSize);

	ctx.fillStyle = "#cecece";

	ctx.font = "32px VCR";
	ctx.textAlign = "center";
	ctx.fillText(`${lovePower}%`, 200, 145);

	ctx.textAlign = "left";

	const fontSizeUsed = drawMultilineText(
		ctx,
		loveMessage,
		{
			rect: {
				x: 30,
				y: 190,
				width: canvas.width - 60,
				height: boxSize
			},
			font: 'VCR',
			verbose: false,
			lineHeight: 1.4,
			minFontSize: 16,
			maxFontSize: 18
		}
	);

	var buffer = canvas.toBuffer();
	fs.writeFileSync(`./data/tmp/${msg.author.id}.png`, buffer);

	fs.readFile(`./data/tmp/${msg.author.id}.png`, function (err, data ) {
		msg.channel.createMessage("", { file: data, name: "love.png" });
	}); 
};