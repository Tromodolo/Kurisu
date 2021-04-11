import eris, { Message } from "eris";
import fs from "fs";
import path from "path";
import { Bot } from "../bot";
import config from "../config";
import KurisuModule from "../models/CommandModule";
import { DiscordEmbed } from "../utility/DiscordEmbed";
import { DatabaseEntities } from "./DatabaseHandler";

import {
	AdminModule,
	FunModule,
	HelpModule,
	ProfileModule,
	SearchModule,
	SocialModule,
	OwnerModule,
} from "../commands";

export class CommandHandler {
	private moduleList: KurisuModule[] = [];
	private bot: Bot;

	constructor(){
		this.messageEvent = this.messageEvent.bind(this);
	}

	initialize(bot: Bot){
		this.bot = bot;
	}

	public get modules(){
		return this.moduleList;
	}

	public loadCommands(){
		this.moduleList = [
			AdminModule,
			FunModule,
			HelpModule,
			ProfileModule,
			SearchModule,
			SocialModule,
			OwnerModule,
		];
	}

	public hookEvent(){
		this.bot.client.on("messageCreate", this.messageEvent);
	}

	public unhookEvent(){
		this.bot.client.off("messageCreate", this.messageEvent);
	}

	private async messageEvent(message: Message){
		if (message.author.bot){
			return;
		}
		const messageArgs = message.content.split(" ");
		// Check if there are any commands that match this message
		if (await this.checkCommand(message, messageArgs)){
			// This means a command was ran, so update database accordingly
			// There is no custom command system in place, but eventually adding that somehow is good
		}
	}

	/**
	 * Returns true or false depending on whether a command was ran
	 * @param {Message} message An erisjs message object
	 * @param {Array} args The message as an array of strings
	 * @param {Array} modules An array of all the loaded commmand modules
	 */
	private async checkCommand(message: eris.Message, args: string[]){
		if (message.author.bot){
			return;
		}

		if (message.content?.toLowerCase().startsWith(config.bot.defaultPrefix.toLowerCase())){
			// Starting at 1 index so that it takes away the prefix
			// This makes it easier to later allow custom prefixes for servers, and just check for those too in the if case above
			args[0] = args[0]?.toLowerCase().substring(config.bot.defaultPrefix.length);

			this.moduleList.forEach(async (module) => {
				if (!message.member){
					return;
				}
				if (module.name.toLowerCase().includes("owner")){
					const devs: any = config.bot.developerIds;
					if (!devs.includes(message.author.id)){
						return;
					}
				}

				try{
					const command = module.findCommand(args[0]?.toLowerCase());
					if (command){
						if (!command.checkPermissions(message.member.permission)){
							throw {title: "No permission", message: "You don't have permission to use this command"};
						}
						if (!module.checkPermissions(message.member.permission)){
							throw {title: "No permission", message: "You don't have permission to use this command"};
						}

						if (command.metadata.delete === true){
							await message.delete();
						}

						const commandArgs = [...args];
						commandArgs.shift();

						const dbUser = await this.bot.db.getOrCreateUser(message.member);
						if (dbUser?.statistics){
							dbUser.statistics.commandsUsed = (dbUser.statistics.commandsUsed ?? 0) + 1;
							await this.bot.db.saveEntity(dbUser, DatabaseEntities.User);
						}
						await command.execute(message, commandArgs);

						return true;
					}
					else{
						return false;
					}
				} catch (e) {
					const errorImg = "https://i.imgur.com/CYmk4fS.png";

					const embed = new DiscordEmbed();
					embed.setAuthor(e.title || "Something went wrong!", undefined, errorImg);
					embed.setColor(parseInt("0xe6675e"));
					embed.setDescription(e.message || e);
					embed.setFooter("If this is a bug, please contact tromo#7430");

					await message.channel.createMessage(embed.getEmbed());
				}
			});
		}
		else{
			return false;
		}
	}
}