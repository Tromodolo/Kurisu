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
			let command: Command | undefined;

			moduleList.forEach((commandModule) => {
				for (const com of commandModule.commands){
					if (com.commandName === args[0]){
						command = com;
					}
				}
			});

			if (!command){
				await bot.createMessage(message.channel.id, "Command was not found.");
				return resolve();
			}
			else{
				embed.setAuthor(`Help for command '${command.commandName}'`, bot.user.avatarURL, bot.user.avatarURL);

				embed.addField("Description",  command.fullDescription, false);
				embed.addField("Aliases", command.aliases.length > 0  ? command.aliases.join(", ").toString() : "**none**", true);
				embed.addField("Usage",  command.usage, true);
				embed.addField("Auto-delete", command.deleteCommand ? "true" : "false", true);
				embed.addField("Requirements",  command.requirements.length > 0 ? command.requirements.join(",\n").toString() : "**none**", true);
			}
		}
		await bot.createMessage(message.channel.id, embed.getEmbed());
		return resolve();
	});
}

export {
	aliases,
	description,
	fullDescription,
	commandFunc,
	commandName,
	usage,
	requirements,
	deleteCommand,
};
