import { Message } from "eris";
import { bot } from "../../bot";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import { Field } from "../../util/DiscordEmbedTypes";

const commandName: string = "createEmbed";
const aliases: string[] = [];
const description: string = "";
const fullDescription: string = "";
const usage: string = "";
const requirements: object = {};
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	const embed = new DiscordEmbed();

	const fields: Field[] = [];

	embed.setAuthor("Elias Mawa", "https://www.sawol.moe", "https://avatars0.githubusercontent.com/u/23219284?s=460&v=4");
	embed.setColor(5043693);
	embed.setDesciption("All hail LORD Tachanka");

	fields[0] = { name: "Big tiddy goth gf", value: "HELL YA BROTHER", inline: false };
	embed.setFields(fields);

	embed.setFooter("https://avatars0.githubusercontent.com/u/23219284?s=460&v=4", "Footer Text");
	embed.setImage("https://avatars0.githubusercontent.com/u/23219284?s=460&v=4");
	embed.setThumbnail("https://avatars0.githubusercontent.com/u/23219284?s=460&v=4");
	embed.setTimestamp("2018-10-10");
	embed.setTitle("Elias Mawa");
	embed.setUrl("https://www.sawol.moe");

	const send_message = new Promise(async (resolve) => {
		bot.createMessage(message.channel.id, embed.getEmbed());
	});

	send_message.catch((err) => {
		console.log(`cannot create embed! ${err}`);
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
