import { Message } from "eris";
import fetch from "node-fetch";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

export default new KurisuCommand (
	{
		name: "manga",
		description: "Looks up manga on Kitsu",
		usage: "manga one piece",
		aliases: [],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1) {
				return reject("Please enter an manga you'd like to look up.");
			}

			const firstMessage = await message.channel.createMessage("Looking up your question, please wait...");

			const searchTerm = args.join(" ");
			const apiCall = `https://kitsu.io/api/edge/manga?filter[text]=${searchTerm}`;

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
				return reject("Sorry, we found no matching manga, please try again later.");
			}

			if (!data){
				return reject("Sorry, we found no matching manga, please try again later.");
			}

			const embed = new DiscordEmbed();
			embed.setAuthor(data?.attributes?.titles?.en ?? data?.attributes?.titles?.en_jp, `https://kitsu.io/manga/${data?.attributes?.slug}`);
			embed.setColor(parseInt("0xfd755c")); // Kitsu.io logo colour
			if (!data?.attributes?.nsfw){
				embed.setThumbnail(data?.attributes?.posterImage?.original);
			}

			embed.setDescription(data?.attributes?.synopsis);
			if (data?.attributes?.titles?.ja_jp){
				embed.addField("Japanese Name", data?.attributes?.titles?.ja_jp, false);
			}

			let mangaType = data?.attributes?.mangaType ?? "Unknown";
			mangaType = mangaType[0].toUpperCase() + mangaType.substr(1);
			embed.addField("Type", mangaType, true);

			embed.addField("Rating", `${data?.attributes?.averageRating}%`, true);

			let status = data?.attributes?.status ?? "Unknown";
			status = status[0].toUpperCase() + status.substr(1);
			embed.addField("Status", status, true);

			if (data?.attributes?.startDate){
				embed.addField("Date", `${data?.attributes?.startDate} - ${data?.attributes?.endDate ?? "Ongoing"}`, true);
			}
			if (data?.attributes?.chapterCount){
				embed.addField("Chapters", data?.attributes?.chapterCount, true);
			}
			if (data?.attributes?.volumeCount){
				embed.addField("Volumes", data?.attributes?.volumeCount, true);
			}

			embed.setFooter("Powered by kitsu.io");

			message.channel.createMessage(embed.getEmbed());

			return resolve(null);
		});
	},
);
