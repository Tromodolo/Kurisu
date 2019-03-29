import { Message } from "eris";
import { bot } from "../../bot";
import { Command } from "../../types";
import { googleLookup, youtubeLookup } from "../../util/Util";

const commandName: string = "google";
const aliases: string[] = [
	"lookup",
];
const description: string = "Googles a specified term";
const fullDescription: string = "Googles a specified term";
const usage: string = "google {term}";
const requirements: string[] = [];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		if (args.length < 1){
			message.channel.createMessage("You need to specify a search term");
		}
		else{
			googleLookup(bot, message, args.join(" "), false);
		}
		return resolve();
	});
}

// Message handler to take care of the in-line message searching
bot.on("messageCreate", (message) => {
	const googleRegex = /((?:Hey\s)?Kurisu (?:could you\s)?(?:please\s)?look up)\s([a-zA-Z0-9åäö].*)/gi;
	const result = googleRegex.exec(message.content);
	if (result){
		if (result.length >= 3){
			let query = result[2];

			// Remove punctuation from the end of the string
			query = query.replace(/\.|\?|\!|\,$/, "");

			if (query.toLowerCase().endsWith("on youtube")){
				// Look stuff up on youtube;
				query = query.replace(/\son youtube$/i, "");
				youtubeLookup(bot, message, query, true);
			}
			else{
				// do the google
				googleLookup(bot, message, query, true);
			}
		}
	}
});

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
