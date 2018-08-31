var exports = module.exports = {};

const client = require("../../bot.js").client,
	  commands = require("../../bot.js").commandList,
	  color = require("../../bot.js").kurisuColour,
	  DiscordEmbed = require("../../utility/DiscordEmbed");

exports.aliases = [

];
exports.description = "Shows the help menu or info about a command";
exports.fullDescription = "Shows this message or info about a command";
exports.usage = "help (command name)";
exports.requirements = {

};

exports.function = (msg, args) => {
	if(args.length < 1){
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
			for(let command of commandModule.commands){
				field.value += `**${command.name}** - ${command.description}\n`;
			}
			embed.embed.fields.push(field);
		});
		client.createMessage(msg.channel.id, embed);
	}
	else{
		let embed = new DiscordEmbed();
		let commandname = args[0];
		let commandInfo = null;

		commands.forEach(modules => {
			modules.commands.forEach(command => {
				if(command.name == commandname){
					commandInfo = command;
					return;
				}
			});
			return;
		});
		
		if(!commandInfo) return "Could not find command"

		let requirements = Object.keys(commandInfo.requirements.permissions).join("\n•");

		if(requirements.length < 1) requirements = "None Required";

		embed.setColor(color);
		embed.setTitle(`Help for command '${commandInfo.name}'`);
		embed.addField("**Description**", commandInfo.description, false);
		embed.addField("**Aliases**", `•${commandInfo.aliases.join("\n•")}`, true);
		embed.addField("**Usage**", commandInfo.usage, true);
		if(commandInfo.requirements) embed.addField("**Permission Requirements**", `•${requirements}`, true);

		client.createMessage(msg.channel.id, embed.getEmbed());
	}
};