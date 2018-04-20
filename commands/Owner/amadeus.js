var exports = module.exports = {},
	config = require("../../bot.js").config,
	client = require("../../bot.js").client,
	base64 = require("node-base64-image"),
	fs = require("fs");
	
let moods = [
	"Annoyed",
	"Cheeky",
	"Closed",
	"Flushed",
	"Happy",
	"Smiling",
	"Talking",
	"Thinking",
	"Upset"
]


exports.function = (msg, args) => {
	if(msg.member.id === config.ownerId){
		if(args.length < 1 || !(moods.indexOf(args[0]) > -1)){
			return "You need to specify a valid mood. Available ones are Annoyed, Cheeky, Closed, Flushed, Happy, Smiling, Talking, Thinking and Upset.";				
		}
		else{
			fs.readFile(`./data/Amadeus/${args[0]}.png`, function(err, data) {
				let base64 = new Buffer(data).toString('base64');
				client.editSelf({ avatar: "data:image/png;base64," + base64 });
				client.createMessage(msg.channel.id, "Mood Changed");
			});/*
			base64.encode(, { string: true }, function(error, result){
				if(!error){
					client.editSelf({ avatar: "data:image/png;base64," + result });
					client.createMessage(msg.channel.id, "Mood Changed");
				}
				else{
					console.log(error);
				}
			});*/
		}
	}
	else{
		return "You don't have permission to use this command.";
	}
};

exports.description = "Sets avatar for bot.";
exports.fullDescription = "Sets avatar for the bot to url you specify.";
exports.usage = "[url]";

