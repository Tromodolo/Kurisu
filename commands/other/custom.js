var exports = module.exports = {};

const fs = require("fs"),
	  client = require("../../bot.js").client,
	  db = require("../../db");

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
						commandname: commandname
					}
				})
				break;
			case 'list':
			case 'List':
				let list = await db.CustomCommands.findAll({ raw: true });
				let listArr = [];
				list.forEach(command => {
					listArr.push(command.commandname);
				});

				return "The current custom commands are: " + listArr.sort().join(", ");

			default:
				return "You need to choose one for the available options. Usage of command is: `[create | edit | remove | list] commandname <commandtext>`"
				break;
		}
	}
	else{
		let list = await db.CustomCommands.findAll({ raw: true });
		let listArr = [];
		list.forEach(command => {
			listArr.push(command.commandname);
		});

		return "The current custom commands are: " + listArr.sort().join(", ");
	}
}

	exports.description = "Custom Command Menu";
	exports.fullDescription = "Command used to create, edit or remove custom commands";
	exports.usage = "[create | edit | remove | list] commandname <commandtext>";
