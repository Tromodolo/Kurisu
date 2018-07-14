var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  DiscordEmbed = require("../../utility/Utility").DiscordEmbed,
	  getUserByMessage = require("../../utility/Utility").getUserByMessage;
	
exports.function = async (msg, args) => {
	let embed = new DiscordEmbed();
	embed.setTimestamp(new Date(Date.now()).toISOString());
	embed.setColor(color);

	if(args[0].toLowerCase() == "server" || args[0].toLowerCase() == "guild"){
		//Get the server
		embed.setTitle(`Avatar for ${msg.channel.guild.name}`);

		let guildAvatar = msg.channel.guild.iconURL.replace("jpg", "png");
		guildAvatar = guildAvatar.replace("?size=128", "?size=1024");

		embed.setUrl(guildAvatar);
		embed.setImage(guildAvatar);
	}
	else{
		let user;

		user = getUserByMessage(msg, args);

		if(!user) return "User not found";

		embed.setTitle(`Avatar for ${user.username}#${user.discriminator}`);
		
		let userAvatar = user.avatarURL.replace("jpg", "png");
		userAvatar = userAvatar.replace("?size=128", "?size=1024");

		embed.setUrl(userAvatar);
		embed.setImage(userAvatar);
	}

	client.createMessage(msg.channel.id, embed.getEmbed());
	return;
};

exports.description = "Shows your, the server's or another person's avatar";
exports.fullDescription = "Shows your, the server's or another person's avatar";
exports.usage = "<emote>";