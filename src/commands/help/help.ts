import { Message } from "eris";
import { Bot } from "../../bot";
import config from "../../config";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
/**
 * help.ts
 *
 * Gets list of commands or information about a specific command
 *
 * Last Edit - March 29 2019 by Tromo
 */

export default new KurisuCommand (
	{
		name: "help",
		description: "Gets list of commands or information about a specific command",
		usage: "help {command}",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			const embed = new DiscordEmbed();

			embed.setColor(parseInt(config.bot.color));

			if (!args[0]){
				embed.setAuthor("List of commands", bot.client.user.avatarURL, bot.client.user.avatarURL);
				embed.setDescription("If you want information about a specific command, type 'help command-name'");
				embed.setFooter(`Use ${config.bot.defaultPrefix}invite to add me to your server`);

				bot.commands.modules.forEach((module) => {
					if (module.name.toLowerCase().includes("owner")){
						if (!config.bot.developerIds.includes(message.author.id)){
							return;
						}
					}
					const moduleCommands = module.commands.map((x) => x.metadata.name).join(", ");
					embed.addField(module.name, moduleCommands, true);
				});
			}
			else{
				let helpCommand: KurisuCommand | undefined;

				bot.commands.modules.forEach((commandModule) => {
					const com = commandModule.findCommand(args[0]);
					if (com){
						helpCommand = com;
					}
				});

				if (!helpCommand){
					return reject("Command was not found.");
				}
				else{
					embed.setAuthor(`Help for command '${helpCommand.metadata.name}'`, bot.client.user.avatarURL, bot.client.user.avatarURL);

					embed.addField("Description",  helpCommand.metadata.description, false);
					embed.addField("Aliases", helpCommand.metadata.aliases.length > 0  ? helpCommand.metadata.aliases.join(", ").toString() : "**none**", true);
					embed.addField("Usage",  helpCommand.metadata.usage, true);
					embed.addField("Auto-delete", helpCommand.metadata.delete ? "true" : "false", true);
					embed.addField("Requirements",  helpCommand.metadata.requirements.length > 0 ? helpCommand.metadata.requirements.join(",\n").toString() : "**none**", true);
				}
			}
			await message.channel.createMessage(embed.getEmbed());
			return resolve(null);
		});
	},
);
