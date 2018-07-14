var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  DiscordEmbed = require("../../utility/DiscordEmbed").DiscordEmbed;
	
exports.function = async (msg, args) => {
	let embed = new DiscordEmbed();
	embed.setTimestamp(new Date(Date.now()).toISOString());
	embed.setColor(color);

	if(args.length == 0){
		//Means get the author
		embed.setTitle(`Avatar for ${msg.author.username}#${msg.author.discriminator}`);
		
		let userAvatar = msg.author.avatarURL.replace("jpg", "png");
		userAvatar = userAvatar.replace("?size=128", "?size=1024");

		embed.setUrl(userAvatar);
		embed.setImage(userAvatar);

		client.createMessage(msg.channel.id, embed.getEmbed());
		return;
	}
	else if(args[0].toLowerCase() == "server" || args[0].toLowerCase() == "guild"){
		//Get the server
		embed.setTitle(`Avatar for ${msg.channel.guild.name}`);

		let guildAvatar = msg.channel.guild.iconURL.replace("jpg", "png");
		guildAvatar = guildAvatar.replace("?size=128", "?size=1024");

		embed.setUrl(guildAvatar);
		embed.setImage(guildAvatar);

		client.createMessage(msg.channel.id, embed.getEmbed());
		return;
	}

	let mentionRegex = /(<@[0-9]*>)(?:\s?\w*)*/gi;

	let mentionCheck = mentionRegex.exec(args.join(" "));

	if(mentionCheck){
		embed.setTitle(`Avatar for ${msg.mentions[0].username}#${msg.mentions[0].discriminator}`);
		
		let userAvatar = msg.mentions[0].avatarURL.replace("jpg", "png");
		userAvatar = userAvatar.replace("?size=128", "?size=1024");

		embed.setUrl(userAvatar);
		embed.setImage(userAvatar);
		//Get first mentioned user
	}
	else{
		let guild = msg.channel.guild;
		
		let userCheck = guild.members.find(x => x.id == args[0]);

		if(!userCheck){
			userCheck = guild.members.find(x => x.username.toLowerCase() == args[0]);
			if(!userCheck){
				userCheck = guild.members.find(x => {
					if(x.nick){
						return x.nick.toLowerCase() == args[0];
					}
					else{
						return false;
					}
				});
				if(!userCheck){
					userCheck = guild.members.find(x => x.username.toLowerCase().includes(args[0]));
					if(!userCheck){
						userCheck = guild.members.find(x => {
							if(x.nick){
								return x.nick.toLowerCase().includes(args[0]);
							}
							else{
								return false;
							}
						});
						if(!userCheck){
							return "User not found";
						}
					}
				}
			}
		}

		embed.setTitle(`Avatar for ${userCheck.user.username}#${userCheck.user.discriminator}`);
		
		let userAvatar = userCheck.avatarURL.replace("jpg", "png");
		userAvatar = userAvatar.replace("?size=128", "?size=1024");

		embed.setUrl(userAvatar);
		embed.setImage(userAvatar);


		//Try to go by the args provided
	}

	client.createMessage(msg.channel.id, embed.getEmbed());
	return;
};

exports.description = "Shows your, the server's or another person's avatar";
exports.fullDescription = "Shows your, the server's or another person's avatar";
exports.usage = "<emote>";