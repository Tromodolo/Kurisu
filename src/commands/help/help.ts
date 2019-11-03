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

export default class Help extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "help",
			description: "Gets list of commands or information about a specific command",
			usage: "help {command}",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const embed = new DiscordEmbed();

			embed.setColor(parseInt(config.bot.color));

			if (!args[0]){
				embed.setAuthor("List of commands", this.bot.client.user.avatarURL, this.bot.client.user.avatarURL);
				embed.setDescription("If you want information about a specific command, type 'help command-name'");

				this.bot.commands.modules.forEach((module) => {
					if (module.name.toLowerCase() === "owner"){
						return;
					}
					const moduleCommands = module.commands.map((x) => x.metadata.name).join(" **|** ");
					embed.addField(module.name, moduleCommands, false);
				});
			}
			else{
				let helpCommand: KurisuCommand | undefined;

				this.bot.commands.modules.forEach((commandModule) => {
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
					embed.setAuthor(`Help for command '${helpCommand.metadata.name}'`, this.bot.client.user.avatarURL, this.bot.client.user.avatarURL);

					embed.addField("Description",  helpCommand.metadata.description, false);
					embed.addField("Aliases", helpCommand.metadata.aliases.length > 0  ? helpCommand.metadata.aliases.join(", ").toString() : "**none**", true);
					embed.addField("Usage",  helpCommand.metadata.usage, true);
					embed.addField("Auto-delete", helpCommand.metadata.delete ? "true" : "false", true);
					embed.addField("Requirements",  helpCommand.metadata.requirements.length > 0 ? helpCommand.metadata.requirements.join(",\n").toString() : "**none**", true);
				}
			}
			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}