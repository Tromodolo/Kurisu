var exports = module.exports = {},
	config = require("../../bot.js").config,
	cmd = require("node-cmd"),
	client = require("../../bot.js").client;

exports.function = async (msg, args) => {
	if(msg.author.id == config.ownerId){
		await client.createMessage(msg.channel.id, "Restarting..");
		cmd.run("pm2 restart Kurisu"); 
	}
};

exports.description = "Sets name for bot.";
exports.fullDescription = "Restarts bot.";
exports.usage = "[name]";

