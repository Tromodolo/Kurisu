import { Message } from "eris";
import KurisuCommand from "../../models/Command";
import { Bot } from "../../bot";

import fetch from "node-fetch";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

interface WeatherData {
	coord: {
		lon: number,
		lat: number,
	};
	weather: Array<{
		id: number,
		main: string,
		description: string,
		icon: string,
	}>;
	base: string;
	main: {
		temp: number,
		feels_like: number,
		temp_min: number,
		temp_max: number,
		pressure: number,
		humidity: number,
	};
	visibility: number;
	wind: {
		speed: number,
		deg: number,
	};
	clouds: {
		all: number,
	};
	dt: number;
	sys: {
		type: number,
		id: number,
		country: string,
		sunrise: number,
		sunset: number,
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

export default class Weather extends KurisuCommand {
	constructor(bot: Bot){
		super(bot, {
			name: "weather",
			description: "Looks up weather for a location",
			usage: "weather Karlstad",
			aliases: [],
			requirements: [],
			delete: false,
		});
	}

	public execute(message: Message, args: string[]) {
		return new Promise(async (resolve, reject) => {
			if (args.length < 1) {
				return reject("Please enter an city.");
			}

			if (!this.bot.cnf.bot.openWeatherMapAppId){
				return reject("This bot isn't configured to use OpenWeatherMap data, please configure before trying again.")
			}

			const firstMessage = await message.channel.createMessage("Looking up your question, please wait...");

			let searchTerm = args.join(",");
			const apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&appid=${this.bot.cnf.bot.openWeatherMapAppId}`;

			let data: WeatherData;
			try{
				const res = await fetch(apiCall);
				data = await res.json();
			}
			catch (e) {
				firstMessage.delete();
				console.error(e);
				return reject("Sorry, something went wrong when trying to find city.");
			}

			if (!data || !data?.name){
				return reject("Sorry, something went wrong when trying to find city.");
			}

			const embed = new DiscordEmbed();
			embed.setAuthor(`Weather in: ${data.name ?? searchTerm} ${data.sys?.country ?? ""}`);
			embed.setColor(parseInt(this.bot.cnf.bot.color));

			if (data.main){
				embed.addField("☀️ Temperature", `${data.main.temp}°C\n${((data.main.temp * 9/5) + 32).toFixed(2)}°F`, true);
			}
			if (data.main){
				embed.addField("💧 Humidity", `${data.main.humidity}%`, true);
			}
			if (data.wind){
				embed.addField("🍃 Wind Speed", `${data.wind.speed}m/s\n${(data.wind.speed * 2.237).toFixed(2)}mph`, true);
			}

			embed.setFooter("Powered by OpenWeatherMap");

			firstMessage.edit(embed.getEmbed());
			return resolve();
		});
	}
}
