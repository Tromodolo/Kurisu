import eris, { Message } from "eris";
import fs from "fs";
import path from "path";
import { Bot } from "../bot";
import config from "../config";
import KurisuModule from "../models/CommandModule";

export class CommandHandler{
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
		fs.readdir(path.join(__dirname, "../commands/"), (folderErr, folders) => {
			folders.forEach((folder) => {
				try{
					const props = require(path.join(__dirname, `../commands/${folder}`));
					if (props){
						const Module = props.default;
						this.moduleList.push(new Module(this.bot));
					}
					return;
				}
				catch (ex){
					console.log(ex);
					return;
				}
			});
		});
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

		if (message.content.startsWith(config.bot.defaultPrefix)){
			// Starting at 1 index so that it takes away the prefix
			// This makes it easier to later allow custom prefixes for servers, and just check for those too in the if case above
			args[0] = args[0].substring(config.bot.defaultPrefix.length);
			this.moduleList.forEach(async (module) => {
				if (!message.member){
					return;
				}
				if (module.name.toLowerCase() === "owner"){
					const devs: any = config.bot.developerIds;
					if (!devs.includes(message.author.id)){
						return;
					}
				}
				const command = module.findCommand(args[0]);
				if (command){
					if (!command.checkPermissions(message.member.permission)){
						message.channel.createMessage("You don't have permission to use this command");
						return;
					}
					if (!module.checkPermissions(message.member.permission)){
						message.channel.createMessage("You don't have permission to use this command");
						return;
					}

					if (command.metadata.delete === true){
						await message.delete();
					}

					const commandArgs = [...args];
					commandArgs.shift();

					await command.run(message, commandArgs);

					return true;
				}
				else{
					return false;
				}
			});
		}
		else{
			return false;
		}
	}
}