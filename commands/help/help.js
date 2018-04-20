var exports = module.exports = {},
	client = require("../../bot.js").client,
	commands = require("../../bot.js").commandList,
	color = require("../../bot.js").kurisuColour;

exports.function = (msg, args) => {
	var embed = {
		"embed": {
			"color": color,
			"author": {
				"name": "Commands for Kurisu",
				"icon_url": client.user.avatarURL
			},
			"fields": [
				
			]
		}
	};

	commands.forEach(function(commandModule){
		var field = { name: commandModule.name, value: "" };
		for(var i in commandModule.commands){
			field.value += `**${commandModule.commands[i].name}** - ${commandModule.commands[i].description}\n`;
		}
		embed.embed.fields.push(field);
	});

	client.createMessage(msg.channel.id, embed);
};

exports.description = "Shows your level";
exports.fullDescription = "Shows this message";
exports.usage = "";
