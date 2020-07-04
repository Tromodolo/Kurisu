import { Message, Channel } from "eris";
import fs from "fs";
import path from "path";

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

			let searchTerm = args.join(",");
			const apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&appid=${this.bot.cnf.bot.openWeatherMapAppId}`;

			let data: WeatherData;
			try{
				const res = await fetch(apiCall);
				data = await res.json();
			}
			catch (e) {
				console.error(e);
				return reject("Sorry, something went wrong when trying to find city.");
			}

			if (!data || !data?.name){
				return reject("Sorry, something went wrong when trying to find city.");
			}

			const embed = new DiscordEmbed();
			embed.setAuthor(`${data.name ?? searchTerm} ${data.sys?.country ?? ""}`);
			embed.setColor(parseInt(this.bot.cnf.bot.color));

			let iconData: Buffer | null = null;

			if (data.weather[0]){
				embed.addField("☁️ Weather", GetWeatherName(data.weather[0].id));
				let icon = data.weather[0].icon;
				// Replace n with d to always use day icons instead of night icons
				icon = icon.replace("n", "d");
				const buffer = fs.readFileSync(path.join(__dirname, `../../../data/weather/${icon}.png`));
				iconData = buffer;
			}
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

			if (iconData !== null){
				embed.setThumbnail("attachment://icon.png");
				await message.channel.createMessage(embed.getEmbed(), { file: iconData, name: "icon.png" });

			}
			else {
				await message.channel.createMessage(embed.getEmbed());
			}

			return resolve();
		});
	}
}

function GetWeatherName(code: number): string {
	switch(code){
		case 200:
			return "Thunderstorm with light rain";
		case 201:
			return "Thunderstorm with rain";
		case 202:
			return "Thunderstorm with heavy rain";
		case 210:
			return "Light thunderstorm";
		case 211:
			return "Thunderstorm";
		case 212:
			return "Heavy thunderstorm";
		case 221:
			return "Ragged thunderstorm";
		case 230:
			return "Thunderstorm with drizzle";
		case 232:
			return "Thunderstorm with heavy drizzle";
		case 300:
			return "Light intensity drizzle";
		case 301:
			return "Drizzle";
		case 302:
			return "Heavy intensity drizzle";
		case 310:
			return "Light intensity drizzle rain";
		case 311:
			return "Drizzle rain";
		case 312:
			return "Heavy intensity drizzle rain";
		case 313:
			return "Shower rain and drizzle";
		case 314:
			return "heavy shower rain and drizzle";
		case 321:
			return "Shower drizzle";
		case 500:
			return "Light rain";
		case 501:
			return "Moderate rain";
		case 502:
			return "Heavy intensity rain";
		case 503:
			return "Very heavy rain";
		case 504:
			return "Extreme rain";
		case 511:
			return "Freezing rain";
		case 520:
			return "Light intensity shower rain";
		case 521:
			return "Shower rain";
		case 522:
			return "Heavy intensity shower rain";
		case 531:
			return "Ragged shower rain";
		case 600:
			return "Light snow";
		case 601:
			return "Snow";
		case 602:
			return "Heavy snow";
		case 611:
			return "Sleet";
		case 612:
			return "Light shower sleet";
		case 613:
			return "Shower sleet";
		case 615:
			return "Light rain and snow";
		case 616:
			return "Rain and snow";
		case 620:
			return "Light shower snow";
		case 621:
			return "Shower snow";
		case 622:
			return "Heavy shower snow";
		case 701:
			return "Mist";
		case 711:
			return "Smoke";
		case 721:
			return "Haze";
		case 731:
			return "Sand/dust whirls";
		case 741:
			return "Fog";
		case 751:
			return "Sand";
		case 761:
			return "Dust";
		case 762:
			return "Volcanic ash";
		case 771:
			return "Squalls";
		case 781:
			return "Tornado";
		case 800:
			return "Clear sky";
		case 801:
			return "Few clouds: 11-25%";
		case 802:
			return "Scattered clouds: 25-50%";
		case 803:
			return "Broken clouds: 51-84%";
		case 804:
			return "Overcast clouds: 85-100%";
		default:
			return "Unknown weather type";
	}
}