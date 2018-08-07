var exports = module.exports = {};

const config = require("../../bot.js").config,
	  client = require("../../bot.js").client,
	  base64 = require("node-base64-image"); 

exports.aliases = [

];
exports.description = "Sets avatar for bot.";
exports.fullDescription = "Sets avatar for the bot to url you specify.";
exports.usage = "setavatar url";
exports.requirements = {
	userIDs: [
		config.ownerId
	]
};

exports.function = (msg, args) => {
	if(args.length < 1){
		return "You need to specify a url";
	}
	else{
		base64.encode(args[0], { string: true }, function(error, result){
			if(!error){
				client.editSelf({ avatar: "data:image/png;base64," + result });
				client.createMessage(msg.channel.id, "Avatar changed! :ok_hand:");
			}
			else{
				console.log(error);
			}
		});
	}
};