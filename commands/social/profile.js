var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  request = require("request"),
	  fs = require("fs"),
	  download = require("image-downloader");
	
exports.function = async (msg, args) => {
	let embed = new DiscordEmbed();

	let user;

	if(args.length == 0){
		user = msg.member;
	}

	let mentionRegex = /(<@[0-9]*>)(?:\s?\w*)*/gi;

	let mentionCheck = mentionRegex.exec(args.join(" "));

	if(mentionCheck){
		user = msg.mentions[0];
	}
	else if(!user){
		let guild = msg.channel.guild;
		user = guild.members.find(x => x.id == args[0]);

		if(!user){
			user = guild.members.find(x => x.username.toLowerCase() == args[0]);
			if(!user){
				user = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[0];
					}
					else{
						return false;
					}
				});
				if(!user){
					user = guild.members.find(x => x.username.toLowerCase().includes(args[0]));
					if(!user){
						user = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[0]);
							}
							else{
								return false;
							}
						});
						if(!user){
							return "User not found";
						}
					}
				}
			}
					
		}
	}

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