import { Message } from "eris";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

export default class Roll extends KurisuCommand {
	private responses: Array<{text: string, type: "bad" | "medium" | "good"}> = [
		{text: "It is certain.", type: "good"},
		{text: "It is decidedly so.", type: "good"},
		{text: "Without a doubt.", type: "good"},
		{text: "Yes - definitely.", type: "good"},
		{text: "You may rely on it.", type: "good"},
		{text: "As I see it, yes.", type: "good"},
		{text: "Most likely.", type: "good"},
		{text: "Outlook good.", type: "good"},
		{text: "Yes.", type: "good"},
		{text: "Signs point to yes.", type: "good"},
		{text: "Reply hazy, try again.", type: "medium"},
		{text: "Ask again later.", type: "medium"},
		{text: "Better not tell you now.", type: "medium"},
		{text: "Cannot predict now.", type: "medium"},
		{text: "Concentrate and ask again.", type: "medium"},
		{text: "Don't count on it.", type: "bad"},
		{text: "No.", type: "bad"},
		{text: "My sources say no.", type: "bad"},
		{text: "Outlook not so good.", type: "bad"},
		{text: "Very doubtful.", type: "bad"},
	];

	constructor(bot: Bot){
		super(bot, {
			name: "8ball",
			description: "Asks the mythical 8ball a question",
			usage: "8ball Am I ever going to get married?",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public run(message: Message, args: string[]) {
		return new Promise(async (resolve) => {
			const rng = Math.floor(Math.random() * this.responses.length);
			const chosenResponse = this.responses[rng];

			const embed = new DiscordEmbed();
			embed.setAuthor("Magic 8-ball", undefined, this.bot.client.user.avatarURL);

			switch (chosenResponse.type){
				case "bad":
					embed.setColor(parseInt("0xe6675e"));
					break;
				case "medium":
					embed.setColor(parseInt("0xe6d15e"));
					break;
				case "good":
					embed.setColor(parseInt("0x9de65e"));
					break;
				default: break;
			}

			embed.setDescription(`:game_die: ${chosenResponse.text}`);

			await message.channel.createMessage(embed.getEmbed());
			return resolve();
		});
	}
}
