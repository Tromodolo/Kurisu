import { Message } from "eris";
import { bot } from "../../bot";
import Command from "../../models/Command";

export default class Prune extends Command {
	constructor(){
		super();
		this.commandName = "roll";
		this.aliases = [
			"rng",
			"random",
		];
		this.description = "Rolls a random number up to 100";
		this.fullDescription = "Rolls a random number up to 100 or a specified max";
		this.usage = "roll [maxnumber]";

		// const requirements: new Object();
		this.requirements = [
			"manageMessages",
		];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			let randomNum: number = 0;
			if (args[0]){
				const maxNum: number = parseInt(args[0]);
				if (isNaN(maxNum)){
					randomNum = Math.ceil(Math.random() * 100);
				}
				else{
					randomNum = Math.ceil(Math.random() * maxNum);
				}
			}
			else{
				randomNum = Math.ceil(Math.random() * 100);
			}
			await message.channel.createMessage(`:game_die:${randomNum}`);
			return resolve();
		});
	}
}
