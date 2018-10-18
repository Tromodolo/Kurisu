import { Message } from "eris";
import { bot } from "../../bot";

const commandName: string = "roll";
const aliases: string[] = [
	"rng",
	"random",
];
const description: string = "Rolls a random number up to 100";
const fullDescription: string = "Rolls a random number up to 100 or a specified max.";
const usage: string = "roll [maxnumber]";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
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
		await bot.createMessage(message.channel.id, `:game_die:${randomNum}`);
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
