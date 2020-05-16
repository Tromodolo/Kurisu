import { Message } from "eris";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";
import { getPrimaryColorFromImageUrl } from "../../utility/Util";
import { DiscordEmbed } from "../../utility/DiscordEmbed";
import ResponseListener from "../../handlers/ResponseListener";

export default class Ouija extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "ouija",
			description: "Asks the spirits to answer question. (Game)",
			usage: "`ouija ______ should be avoided at any cost`",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			const promptQuestion = await message.channel.createMessage("Please enter a question.");
			let question: Message;
			try{
				question = await ResponseListener.waitForMessage(this.bot.client, message.channel, message.author.id, 30 * 1000);
				await promptQuestion.delete();

				if (question.content.length < 1){
					return reject("The question needs to be at least 1 character long. Please try again.");
				}
			}
			catch{
				return reject("The command ran out of time. Please try again.");
			}

			const guideMessage = await message.channel.createMessage(`Waiting for spirits to answer your question.
_Spirits need to enter one letter at a time. An answer is decided when someone enters 'goodbye', or when 60 seconds has passed without a message._`);

			let waitingForLetters = true;
			let answer = "";

			while(waitingForLetters){
				try{
					const ghostAnswer = await ResponseListener.waitForMessage(this.bot.client, message.channel, undefined, 30 * 1000);
					if (ghostAnswer.content.length === 1){
						answer += ghostAnswer.content;
					}
					else if (ghostAnswer.content.toLowerCase() === "goodbye"){
						guideMessage.delete();
						waitingForLetters = false;
						break;
					}
				}
				catch {
					guideMessage.delete();
					waitingForLetters = false;
					break;
				}
			}

			const embed = new DiscordEmbed();
			embed.setColor(parseInt(this.bot.cnf.bot.color));

			embed.setTitle("The spirits have answered your question:");
			embed.setDescription(`
**You asked:**
\`${question.content}\`
**The spirits answered:**
\`${answer.toUpperCase()}\`
			`);
			embed.setTimestamp(new Date());

			await message.channel.createMessage(embed.getEmbed());

			return resolve();
		});
	}
}
