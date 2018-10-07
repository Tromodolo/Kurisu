var exports = module.exports = {};

const fs = require("fs"),
	  client = require("../../bot.js").client,
	  db = require("../../db");

exports.aliases = [

];
exports.description = "Custom Command Menu";
exports.fullDescription = "Command used to create, edit or remove custom commands.";
exports.usage = "custom [create | edit | remove | list] commandname <commandtext>";
exports.requirements = {

};

exports.function = async (msg, args) => {
	if(msg.member.permission.json.manageGuild || msg.member.id == 123184215423582208){
		let choice = args[0],
			commandname = args[1],
			commandtextpre = args.splice(2);
			commandtext = commandtextpre.join(" ");
		
		if(!choice){
			return "You need to select an option to use. Usage of command is: `[create | edit | remove | list] commandname <commandtext>`"
		}

		switch(choice){
			case 'create':
			case 'Create':
				if(!commandname){
					return "You need to enter a command name";
				}
				if(!commandtext){
					return "You need to enter command text";
				}
				await db.CustomCommands.create({
					guildid: msg.channel.guild.id,
					commandname: commandname,
					commandtext: commandtext
				});
				break;
			case 'edit':
			case 'Edit':
				if(!commandname){
					return "You need to enter a command to edit";
				}
				if(!commandtext){
					return "You need to enter what to change text to for the edited command";
				}
				await db.CustomCommands.upsert({
					guildid: msg.channel.guild.id,
					commandname: commandname,
					commandtext: commandtext
				})
				break;
			case 'remove':
			case 'Remove':
				if(!commandname){
					return "You need to enter a command to remove";
				}
				await db.CustomCommands.destroy({
					where: {
						commandname: commandname,
						guildid: msg.channel.guild.id
					}
				})
				break;
			case 'list':
			case 'List':
				let list = await db.CustomCommands.findAll({ where: { guildid: msg.channel.guild.id }},{ raw: true });
				let listArr = [];
				list.forEach(command => {
					listArr.push(command.commandname);
				});

				return "The current custom commands for this server are: " + listArr.sort().join(", ");

			default:
				return "You need to choose one for the available options. Usage of command is: `[create | edit | remove | list] commandname <commandtext>`"
				break;
		}
	}
	else{
		let list = await db.CustomCommands.findAll({ where: { guildid: msg.channel.guild.id }},{ raw: true });
		let listArr = [];
		list.forEach(command => {
			listArr.push(command.commandname);
		});

		return "The current custom commands for this server are: " + listArr.sort().join(", ");
	}
}