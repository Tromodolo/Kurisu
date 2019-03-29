import fs from "fs";
import path from "path";

const botData = fs.readFileSync(path.join(__dirname, "./bot.json"));
if (!botData){
	console.error("bot.json file needs to be edited. Please take a look at the example file in config for guidance");
}
const bot: {
	developers: Array<{name: string}>,
	developerIds: string[],
	libraryVersion: string,
	color: string,
	xpMoneyEnabled: boolean,
	defaultPrefix: string,
	botToken: string,
	devToken: string,
	googleApiKey: string,
	googleCustomSearchId: string,
} = JSON.parse(botData.toString("utf-8"));

const dbData = fs.readFileSync(path.join(__dirname, "./db.json"));
if (!dbData){
	console.error("db.json file needs to be edited. Please take a look at the example file in config for guidance");
}
const db: {
	databaseHost: string,
	databaseName: string,
	databaseUsername: string,
	databasePassword: string,
	databaseType: string,
} = JSON.parse(dbData.toString("utf-8"));

const config = {
	bot,
	db,
};

export default config;