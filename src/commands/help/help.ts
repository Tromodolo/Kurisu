/**
 * help.ts
 *
 * Gets list of commands or information about a specific command
 *
 * Last Edit - Oct 19, 2018 by Tromo
 */

import { Message } from "eris";
import { bot, moduleList } from "../../bot";
import { generalConfig } from "../../config/";
import { Command } from "../../types";
import { DiscordEmbed } from "../../util/DiscordEmbed";

const commandName: string = "help";
const aliases: string[] = [];
const description: string = "Gets list of commands or information about a specific command";
const fullDescription: string = "Gets list of commands or information about a specific command";
const usage: string = "help [command]";
const requirements: string[] = [
];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const embed = new DiscordEmbed();

		embed.setColor(parseInt(generalConfig.color));

		if (!args[0]){
			embed.setAuthor("List of commands", bot.user.avatarURL, bot.user.avatarURL);
			embed.setDescription("If you want information about a specific command, type 'help command-name'");

			moduleList.forEach((module) => {
				if (module.name.toLowerCase() === "owner"){
					return;
				}
				const commands = module.commands.map((x) => x.commandName).join(", ");
				embed.addField(module.name, commands, false);
			});
		}
		else{
			let helpCommand: Command | undefined;

			moduleList.forEach((commandModule) => {
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

const command = new Command(
	commandName,
	description,
	fullDescription,
	usage,
	aliases,
	requirements,
	deleteCommand,
	commandFunc,
);

export default command;
