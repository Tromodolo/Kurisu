var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
	  DiscordEmbed = require("../../utility/DiscordEmbed"),
	  getUserByMessage = require("../../utility/Utility").getUserByMessage,
	  moment = require("moment");

exports.aliases = [
	"userinfo",
	"whois",
	"info"
]
exports.description = "Gets your or another person's information";
exports.fullDescription = "Gets your or another person's information";
exports.usage = "user tromo";
exports.requirements = {
	
}

exports.function = async (msg, args) => {
	let embed = new DiscordEmbed();
	embed.setColor(color);

	let user;

	user = getUserByMessage(msg, args);

	if(!user) return "User not found";

	console.log(user);
	
	let userAvatar = user.avatarURL.replace("jpg", "png");
	userAvatar = userAvatar.replace("?size=128", "?size=1024");
	embed.setThumbnail(userAvatar);

	embed.setAuthor(`${user.username}#${user.discriminator}`, "", `${userAvatar}`)

	embed.addField(
		"ID",
		user.id,
		false
	);

	embed.addField(
		"Playing",
		user.game.name || "Nothing",
		false
	);

	embed.addField(
		"Status",
		user.status || "*unavailable*",
		true
	);

	embed.addField(
		"Nickname",
		user.nick || "*unavailable*",
		true
	);

	embed.addField(
		"Account Created",
		moment(user.createdAt).format("lll"),
		false
	);
	embed.addField(
		"Join Date",
		moment(user.joinedAt).format("lll"),
		false
	);

	client.createMessage(msg.channel.id, embed.getEmbed());
	return;
};