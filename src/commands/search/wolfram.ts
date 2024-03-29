import { Message } from "eris";
import fetch from "node-fetch";
import { Bot } from "../../bot";
import KurisuCommand from "../../models/Command";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

export default new KurisuCommand (
	{
		name: "wolfram",
		description: "Looks up question on wolfram alpha",
		usage: "wolfram Density of steel",
		aliases: [
			"wa",
			"wolframalpha",
			"define",
		],
		requirements: [],
		delete: false,
	},
	(message: Message, args: string[], bot: Bot) => {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1) {
				return reject("Please add a question you'd like the answer to.\nEg: '>wolfram Density of steel'");
			}

			const firstMessage = await message.channel.createMessage("Looking up your question, please wait...");

			const searchTerm = args.join(" ");
			const apiCall = `http://api.wolframalpha.com/v2/query?appid=${bot.cnf.bot.wolframAlphaAppId}&input=${encodeURIComponent(searchTerm)}&output=json`;

			let data;
			try{
				const res = await fetch(apiCall);
				data = await res.json();
				firstMessage.delete();
			}
			catch (e) {
				firstMessage.delete();
				console.error(e);
				return reject("Sorry, we have currently run out of Wolfram|Alpha queries, please try again later.");
			}

			const numberPods = data?.queryresult?.numpods;
			if (numberPods === 0) {
				return reject({title: "Nothing found", message: "Sorry, Wolfram|Alpha could not figure our your question. Please reword it or try again later."});
			}

			const embed = new DiscordEmbed();
			embed.setAuthor("Wolfram|Alpha Answer", "https://www.wolframalpha.com/", bot.client.user.avatarURL);
			embed.setColor(parseInt(bot.cnf.bot.color));
			embed.setTimestamp(new Date());

			if (numberPods > 5){
				data.queryresult.pods = data.queryresult.pods.slice(0, 5);
			}

			let foundImage = false;
			for (const pod of data.queryresult.pods){
				if (pod.title){
					if (!foundImage && pod.subpods[0]?.img?.src && !(pod.id === "Input")){
						embed.setImage(pod.subpods[0]?.img?.src);
						foundImage = true;
					}
					if (pod.subpods[0]?.plaintext){
						embed.addField(pod.title, pod.subpods[0]?.plaintext ?? "", false);
					}
				}
			}

			message.channel.createMessage(embed.getEmbed());

			return resolve(null);
		});
	},
);
