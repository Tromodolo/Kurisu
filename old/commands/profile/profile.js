var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  request = require("request"),
	  fs = require("fs"),
	  download = require("image-downloader"),
	  getUserByMessage = require("../../utility/Utility").getUserByMessage,
	  db = require("../../db");

const { createCanvas, loadImage, Image, registerFont } = require('canvas');
const drawMultilineText = require('canvas-multiline-text');

exports.aliases = [

];
exports.description = "Shows your or another user's profile";
exports.fullDescription = "Shows your or another user's profile";
exports.usage = "profile username";
exports.requirements = {

};

registerFont("./data/fonts/Raleway-Medium.ttf", { family: 'Raleway' });

exports.function = async (msg, args) => {
	let user;

	user = getUserByMessage(msg, args);

	if(!user) return "User was not found";
	
	let avatarUrl = user.user.dynamicAvatarURL("png", "1024");

	let options = {
		url: avatarUrl,
		dest: `./data/tmp/discordavatars/${user.id}.png`        // Save to /path/to/dest/photo.jpg
	};
	
	await download.image(options);
	
	let userLevel = await db.UserLevels.find({ raw: true, where: { userid: user.id }});
	let profileData = await db.ProfileData.find({ raw: true, where: { userid: user.id }});

	const canvas = createCanvas(600, 400);
	const ctx = canvas.getContext('2d');

	let lightFont = "#ededed";
	let darkFont = "#333333";
	let descBackground = "#dddddd";
	let statsBackground = "#d3d3d3";
	let notFilledXp = "#849dff";
	let filledXp = "#5556c6";

	let primaryColour = hexToRgb(profileData.primarycolour);
	primaryDark = isDark(`rgb(${primaryColour.r}, ${primaryColour.g}, ${primaryColour.b})`);

	/* ctx.fillStyle= profiledata.primarycolour;
		ctx.fillRect(0, -100, 220, 300); */
		
	ctx.fillStyle = profileData.primarycolour;
	ctx.fillRect(0, 0, 460, 185);

	ctx.rotate(-0.80);

	ctx.fillStyle = profileData.secondarycolour;

	for(let i = 1; i <= 13; i++){
		ctx.fillRect(-200 + (i * 15), -20 + (i * 35), 380, 20);
	}

	ctx.rotate(0.80);

	//Background behind description
	ctx.fillStyle = descBackground;
	ctx.fillRect(0, 185, 460, 415);

	//Background under profile picture and name
	ctx.fillStyle = profileData.primarycolour;
	ctx.fillRect(25, 25, 135, 135);

	//drawing avatar
	let avatarImg = new Image();
	avatarImg.src = fs.readFileSync(`./data/tmp/discordavatars/${user.id}.png`);
	ctx.drawImage(avatarImg, 28, 28, 129, 129);

	ctx.font="22px Raleway";
	let text = ctx.measureText(`${user.username}#${user.discriminator}`);
	
	ctx.fillStyle = profileData.primarycolour;
	ctx.fillRect(160, 45, text.width + 20, 80);

	if(primaryDark) ctx.fillStyle = lightFont;
	else ctx.fillStyle = darkFont;
	ctx.fillText(`${user.username}#${user.discriminator}`, 170, 75);

	//Background to the right of the profile
	ctx.fillStyle = statsBackground;
	ctx.fillRect(420, 0, 180, 400);

	if(profileData.countrycode){
		fs.access(`./data/flags/${profileData.countrycode}.png`, fs.constants.F_OK, async (err) => {
			//if the file doesn't exist, download it
			if(err){
				//https://countryflags.io/#country_codes
				await download.image({
					url: `https://www.countryflags.io/${profileData.countrycode}/flat/64.png`,
					dest: `./data/flags/${profileData.countrycode}.png`        
				});
			}else{
				return;
			}
		});
	
		try{
			let flagImg = new Image();
			flagImg.src = fs.readFileSync(`./data/flags/${profileData.countrycode}.png`);
			ctx.drawImage(flagImg, 167, 84, 32, 32);
	
			if(primaryDark) ctx.fillStyle = lightFont;
			else ctx.fillStyle = darkFont;
			ctx.fillText(`Lvl ${userLevel.level}`, 205, 108);
		}
		catch(e) {
			if(primaryDark) ctx.fillStyle = lightFont;
			else ctx.fillStyle = darkFont;
			ctx.fillText(`Lvl ${userLevel.level}`, 170, 108);
		}
	}
	else{
		if(primaryDark) ctx.fillStyle = lightFont;
		else ctx.fillStyle = darkFont;
		ctx.fillText(`Lvl ${userLevel.level}`, 170, 108);
	}

	ctx.font = "18px Raleway";
	ctx.fillStyle = darkFont;
	ctx.fillText(`Description`, 18, 215);

	
	let currentXp = 0, levelXp = 0, percentage = 0;
	
	levelXp = ((5 * Math.pow(userLevel.level, 2)) + (40 * userLevel.level) + 55);
	currentXp = userLevel.currentxp;
	
	percentage = currentXp / levelXp;

	percentage = Math.round(percentage * 100);
	
	if(currentXp > 1000){
		currentXp = currentXp / 1000;
		currentXp = currentXp.toFixed(1);
		currentXp = currentXp + "K";
	}
	if(levelXp > 1000){
		levelXp = levelXp / 1000;
		levelXp = levelXp.toFixed(1);
		levelXp = levelXp + "K";
	}
	
	ctx.fillText(`Level ${userLevel.level}`, 440, 40);

	ctx.fillText(`XP: ${currentXp}/${levelXp}`, 440, 65);

	ctx.fillText(`${percentage}%`, 440, 90);

	ctx.fillStyle = notFilledXp;
	ctx.fillRect(484, 74, 100, 20);

	ctx.fillStyle = filledXp;
	ctx.fillRect(484, 74, percentage, 20);

	ctx.rotate(1.50);
	ctx.fillStyle = darkFont;
	ctx.font = "20px Raleway";
	ctx.fillText("THIS SPACE ISNT USED YET", 158, -480);

	ctx.rotate(-1.50);
	ctx.fillStyle = darkFont;
	const fontSizeUsed = drawMultilineText(
		ctx,
		profileData.profiledescription,
		{
			rect: {
				x: 20,
				y: 225,
				width: 400 - 40,
				height: 200
			},
			font: 'Raleway',
			verbose: false,
			lineHeight: 1.27,
			minFontSize: 17,
			maxFontSize: 18
		}
	);

	var buffer = canvas.toBuffer();
	msg.channel.createMessage("", { file: buffer, name: "profile.png" });	
};


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function isDark( color ) {
    var match = /rgb\((\d+).*?(\d+).*?(\d+)\)/.exec(color);
    return ( match[1] & 255 )
         + ( match[2] & 255 )
         + ( match[3] & 255 )
           < 3 * 256 / 2;
}