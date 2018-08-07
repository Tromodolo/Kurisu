/*  */
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

	if(!user || user.id == msg.member.id) return "(✿･∀･)／＼(･∀･✿)";

	client.createMessage(msg.channel.id, `${msg.member.mention}(*･∀･)／＼(･∀･*)${user.mention}`);
	return;
};