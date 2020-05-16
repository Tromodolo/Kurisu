import { Message } from "eris";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";

import fetch from "node-fetch";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

export default class Anime extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "anime",
			description: "Looks up anime on Kitsu",
			usage: "anime cowboy bebop",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1) {
				return reject("Please enter an anime you'd like to look up.");
			}

			const firstMessage = await message.channel.createMessage("Looking up your question, please wait...");

			const searchTerm = args.join(" ");
			const apiCall = `https://kitsu.io/api/edge/anime?filter[text]=${searchTerm}`;

			let data;
			try{
				const res = await fetch(apiCall);
				const resData = await res.json();
				data = resData?.data[0];
				firstMessage.delete();
			}
			catch (e) {
				firstMessage.delete();
				console.error(e);
				return reject("Sorry, we found no matching anime, please try again later.");
			}

			if (!data){
				return reject("Sorry, we found no matching anime, please try again later.");
			}

			const embed = new DiscordEmbed();
			embed.setAuthor(data?.attributes?.titles?.en ?? data?.attributes?.titles?.en_jp, `https://kitsu.io/anime/${data?.attributes?.slug}`);
			embed.setColor(parseInt("0xfd755c")); // Kitsu.io logo colour
			if (!data?.attributes?.nsfw){
				embed.setThumbnail(data?.attributes?.posterImage?.original);
			}

			embed.setDescription(data?.attributes?.synopsis);
			if (data?.attributes?.titles?.ja_jp){
				embed.addField("Japanese Name", data?.attributes?.titles?.ja_jp, false);
			}
			embed.addField("Type", data?.attributes?.subtype, true);
			embed.addField("Rating", `${data?.attributes?.averageRating}%`, true);

			let status = data?.attributes?.status ?? "Unknown";
			status = status[0].toUpperCase() + status.substr(1);
			embed.addField("Status", status, true);

			if (data?.attributes?.startDate){
				const startDate = new Date(data?.attributes?.startDate);

				let season = "Spring";

				if (startDate.getMonth() <= 2){
					season = "Winter";
				}
				else if (startDate.getMonth() <= 5){
					season = "Spring";
				}
				else if (startDate.getMonth() <= 8){
					season = "Summer";
				}
				else if (startDate.getMonth() <= 11){
					season = "Autumn";
				}
				embed.addField("Season", `${season} ${startDate.getFullYear()} `, true);

				embed.addField("Date", `${data?.attributes?.startDate} - ${data?.attributes?.endDate ?? "Ongoing"}`, true);
			}

			if (data?.attributes?.episodeCount){
				embed.addField("Episodes", data?.attributes?.episodeCount, true);
			}

			embed.setFooter("Powered by kitsu.io");

			message.channel.createMessage(embed.getEmbed());

			return resolve();
		});
	}
}
