var exports = module.exports = {};

const config = require("../../bot.js").config,
	  cmd = require("node-cmd"),
	  client = require("../../bot.js").client;

exports.aliases = [

];
exports.description = "Sets name for bot.";
exports.fullDescription = "Restarts bot.";
exports.usage = "restart";
exports.requirements = {
	userIDs: [
		config.ownerId
	]
};

exports.function = async (msg, args) => {
	await client.createMessage(msg.channel.id, "Restarting..");
	cmd.run("pm2 restart Kurisu"); 
};