var exports = module.exports = {};

const config = require("../../bot.js").config,
	  cmd = require("node-cmd"),
	  client = require("../../bot.js").client;

exports.function = async (msg, args) => {
	if(msg.author.id == config.ownerId){
		await client.createMessage(msg.channel.id, "Shutting down..");
		cmd.run("pm2 stop Kurisu"); 
	}
};

exports.description = "Sets name for bot.";
exports.fullDescription = "Stops bot.";
exports.usage = "[name]";

