/**
 * help.ts
 *
 * Gets list of commands or information about a specific command
 *
 * Last Edit - Oct 19, 2018 by Tromo
 */

import { Message } from "eris";
import { bot, moduleList } from "../../bot";
import * as config from "../../config.json";
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

		embed.setColor(parseInt(config.color));

		if (!args[0]){
			embed.setAuthor("List of commands", bot.user.avatarURL, bot.user.avatarURL);
			embed.setDescription("If you want information about a specific command, type 'help command-name'");

			moduleList.forEach((module) => {
				const commands = module.commands.map((x) => x.commandName).join(", ");
				embed.addField(module.name, commands, false);
			});
		}
		else{
			let helpCommand: Command | undefined;

			moduleList.forEach((commandModule) => {
				for (const com of commandModule.commands){
					if (com.commandName === args[0]){
						helpCommand = com;
					}
				}
			});

			if (!helpCommand){
				await bot.createMessage(message.channel.id, "Command was not found.");
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
		await bot.createMessage(message.channel.id, embed.getEmbed());
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
