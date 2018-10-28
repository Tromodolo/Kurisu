import { Message } from "eris";
import { bot } from "../../bot";
import { Command } from "../../types";
import { DiscordEmbed } from "../../util/DiscordEmbed";
import { Field } from "../../util/DiscordEmbedTypes";

const commandName: string = "createEmbed";
const aliases: string[] = [];
const description: string = "";
const fullDescription: string = "";
const usage: string = "";
const requirements: string[] = [];
const deleteCommand: boolean = false;

async function commandFunc(message: Message, args: string[]) {
	return new Promise(async (resolve) => {
		const embed = new DiscordEmbed();

		const fields: Field[] = [];

		embed.setAuthor("Elias Mawa", "https://www.sawol.moe", "https://avatars0.githubusercontent.com/u/23219284?s=460&v=4");
		embed.setColor(5043693);
		embed.setDescription("All hail LORD Tachanka");

		fields[0] = { name: "Big tiddy goth gf", value: "HELL YA BROTHER", inline: false };
		embed.setFields(fields);

		embed.setFooter("https://avatars0.githubusercontent.com/u/23219284?s=460&v=4", "Footer Text");
		embed.setImage("https://avatars0.githubusercontent.com/u/23219284?s=460&v=4");
		embed.setThumbnail("https://avatars0.githubusercontent.com/u/23219284?s=460&v=4");
		embed.setTimestamp("2018-10-10");
		embed.setTitle("Elias Mawa");
		embed.setUrl("https://www.sawol.moe");

		await message.channel.createMessage(embed.getEmbed());
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
