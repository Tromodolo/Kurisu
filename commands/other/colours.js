
var exports = module.exports = {},
client = require("../../bot.js").client,
db = require("../../db");

exports.function = async (msg, args) => {
	var description = "**List of Colour Roles:\n**\n";

	let colours = await db.ColourRoles.findAll({ raw: true, order: [["order", "ASC"]] });

	description += "React to this message with these emotes to receive a role.\nUnreact to remove a role you already have.\n\n";

	colours.forEach((e) =>{
		description += "<:" + e.emotename + ":" + e.emoteid + "> - " + e.description + "\n";
	})

	var reactMessage = await client.createMessage(msg.channel.id, {
		"embed": {
			"description": description,
			"color": 0xff4141
		}
	});

	await db.Config.update({
		colorreactionid: reactMessage.id
	},
	{
		where:{
			id: 1
		}
	});

	colours.forEach( (e) =>{
		var reactionid = e.emotename + ":" + e.emoteid;
		reactMessage.addReaction(reactionid);
	});

}

exports.description = "Shows autoassign role menu";
exports.fullDescription = "Shows autoassign role menu";
exports.usage = "";
