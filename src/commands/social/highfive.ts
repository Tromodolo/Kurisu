/**
 * highfive.ts
 *
 * High fives another user
 *
 * Last Edit - Oct 18, 2018 by Tromo
 */

import { Message } from "eris";
import Command from "../../models/Command";
import { getUserByMessage } from "../../utility/Util";

export default class HighFive extends Command {
	constructor(){
		super();
		this.commandName = "highfive";
		this.aliases = [];
		this.description = "High fives another user";
		this.fullDescription = "High fives another user";
		this.usage = "highfive [user]";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public exec(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const user = getUserByMessage(message, args);

			if (user && message.member){
				message.channel.createMessage(`${message.member.mention}(✿･∀･)／＼(･∀･✿)${user.mention}`);
			}
			else{
				message.channel.createMessage("(✿･∀･)／＼(･∀･✿)");
			}

			return resolve();
		});
	}
}