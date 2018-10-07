var exports = module.exports = {};

const config = require("../../bot.js").config,
	  cmd = require("node-cmd"),
	  client = require("../../bot.js").client;

exports.aliases = [

];
exports.description = "Sets name for bot.";
exports.fullDescription = "Stops bot.";
exports.usage = "[name]";
exports.requirements = {
	userIDs: [
		config.ownerId
	]
};

exports.function = async (msg, args) => {
	await client.createMessage(msg.channel.id, "Shutting down..");
	//This is very much hardcoded to use pm2
	cmd.run("pm2 stop Kurisu"); 
};