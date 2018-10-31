import { Message } from "eris";
import { bot } from "../../bot";
import { Command } from "../../types";
import TriviaHandler from "../../util/TriviaHandler";

const commandName: string = "trivia";
const aliases: string[] = [
	"quiz",
];
const description: string = "Starts trivia game";
const fullDescription: string = "Starts trivia game";
const usage: string = "trivia";

// const requirements: new Object();
const requirements: string[] = [];
const deleteCommand: boolean = false;

function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const trivia = new TriviaHandler(message.channel.id, bot);
		trivia.startTrivia();
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
