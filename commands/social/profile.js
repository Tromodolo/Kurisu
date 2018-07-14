var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  request = require("request"),
	  fs = require("fs"),
	  download = require("image-downloader"),
	  getUserByMessage = require("../../utility/Utility").getUserByMessage;
	
exports.function = async (msg, args) => {
	let embed = new DiscordEmbed();

	let user;

	user = getUserByMessage(msg, args);

	if(!user) return "User was not found";
	
	let options = {
		url: `https://tro.moe/leblanc/avatar/${user.id}`,
		dest: `./data/tmp/discordavatars/${user.id}.png`        // Save to /path/to/dest/photo.jpg
	};
	
	download.image(options)
		.then(({ filename, image }) => {
			fs.readFile(`./data/tmp/discordavatars/${user.id}.png`, function (err, data ) {
				msg.channel.createMessage("", { file: data, name: "profile.png" });
			});
		}).catch((err) => {
			throw err;
		});		
	
};

exports.description = "Shows your or another user's profile";
exports.fullDescription = "Shows your or another user's profile";
exports.usage = "<emote>";