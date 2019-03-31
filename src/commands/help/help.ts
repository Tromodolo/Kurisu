import { Message } from "eris";
import { bot, commands } from "../../bot";
import config from "../../config";
import Command from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
/**
 * help.ts
 *
 * Gets list of commands or information about a specific command
 *
 * Last Edit - March 29 2019 by Tromo
 */

export default class Help extends Command {
	constructor(){
		super();
		this.commandName = "help";
		this.aliases = [];
		this.description = "Gets list of commands or information about a specific command";
		this.fullDescription = "Gets list of commands or information about a specific command";
		this.usage = "help [command]";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const embed = new DiscordEmbed();

			embed.setColor(parseInt(config.bot.color));

			if (!args[0]){
				embed.setAuthor("List of commands", bot.user.avatarURL, bot.user.avatarURL);
				embed.setDescription("If you want information about a specific command, type 'help command-name'");

				commands.modules.forEach((module) => {
					if (module.name.toLowerCase() === "owner"){
						return;
					}
					const moduleCommands = module.commands.map((x) => x.commandName).join(", ");
					embed.addField(module.name, moduleCommands, false);
				});
			}
			else{
				let helpCommand: Command | undefined;

				commands.modules.forEach((commandModule) => {
					const com = commandModule.findCommand(args[0]);
					if (com){
						helpCommand = com;
					}
				});

				if (!helpCommand){
					await message.channel.createMessage("Command was not found.");
					return resolve();
				}
				else{
					embed.setAuthor(`Help for command '${helpCommand.commandName}'`, bot.user.avatarURL, bot.user.avatarURL);

					embed.addField("Description",  helpCommand.fullDescription, false);
					embed.addField("Aliases", helpCommand.aliases.length > 0  ? helpCommand.aliases.join(", ").toString() : "**none**", true);
					embed.addField("Usage",  helpCommand.usage, true);
					embed.addField("Auto-delete", helpCommand.deleteCommand ? "true" : "false", true);
					embed.addField("Requirements",  helpCommand.requirements.length > 0 ? helpCommand.requirements.join(",\n").toString() : "**none**", true);
				}
			}
			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}