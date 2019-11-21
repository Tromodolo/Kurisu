import { Message } from "eris";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";

export default class Roll extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "roll",
			description: "Rolls a random number up to 100 or a specified max",
			usage: "roll {Max Number}",
			aliases: [
				"rng",
				"random",
			],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
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
