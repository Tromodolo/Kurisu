var exports = module.exports = {};

const client = require("../../bot.js").client,
	  commands = require("../../bot.js").commandList,
	  color = require("../../bot.js").kurisuColour;

exports.function = (msg, args) => {
	let embed = {
		"embed": {
			"color": color,
			"author": {
				"name": "Commands for Kurisu",
				"icon_url": client.user.avatarURL
			},
			"fields": []
		}
	};

	commands.forEach(function(commandModule){
		if(commandModule.name == "owner") return;

		if(commandModule.name == "leblanc-specific" && msg.channel.guild.id != "331573354291265548") return;

		let field = { name: (commandModule.name.charAt(0).toUpperCase() + commandModule.name.slice(1)), value: "" };
		for(let i in commandModule.commands){
			field.value += `**${commandModule.commands[i].name}** - ${commandModule.commands[i].description}\n`;
		}
		embed.embed.fields.push(field);
	});

	client.createMessage(msg.channel.id, embed);
};

exports.description = "Shows the help menu";
exports.fullDescription = "Shows this message";
exports.usage = "";
