var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  request = require("request"),
	  fs = require("fs"),
	  download = require("image-downloader");
	
exports.function = async (msg, args) => {
	let options = {
		url: `https://tro.moe/leblanc/avatar/${msg.author.id}`,
		dest: `./data/tmp/discordavatars/${msg.author.id}.png`        // Save to /path/to/dest/photo.jpg
	};
	
	download.image(options)
		.then(({ filename, image }) => {
			fs.readFile(`./data/tmp/discordavatars/${msg.author.id}.png`, function (err, data ) {
				msg.channel.createMessage("", { file: data, name: "profile.png" });
			});
		}).catch((err) => {
			throw err;
		});		
	
};

exports.description = "Shows info about a discord emote";
exports.fullDescription = "Shows information about a custom discord emote";
exports.usage = "<emote>";