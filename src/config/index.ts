import fs from "fs";
import path from "path";

// empty bot.json
let bot = {
	developers: [],
	developerIds: [],
	libraryVersion: "",
	color: "0x000000",
	xpMoneyEnabled: true,
	defaultPrefix: ">",
	botToken: "",
	devToken: "",
	googleApiKey: "",
	googleCustomSearchId: "",
};

// empty db.json
let db = {
	databaseHost: "",
	databaseName: "",
	databaseUsername: "",
	databasePassword: "",
	databaseType: "",
};

try{
	const botData = fs.readFileSync(path.join(__dirname, "./bot.json"));
	if (!botData){
		console.error("bot.json file needs to be edited. Please take a look at the example file in config for guidance");
	}
	bot = JSON.parse(botData.toString("utf-8"));
}
catch (err){
	console.error("bot.json file has been generated. Please edit the file for the bot to work properly.");
	fs.writeFileSync(path.join(__dirname, "./bot.json"), JSON.stringify(bot, null, 2));
}

try{
	const dbData = fs.readFileSync(path.join(__dirname, "./db.json"));
	if (!dbData){
		console.error("db.json file needs to be edited. Please take a look at the example file in config for guidance");
	}
	db = JSON.parse(dbData.toString("utf-8"));
}
catch (err){
	console.error("db.json file has been generated. Please edit the file for the bot to work properly.");
	fs.writeFileSync(path.join(__dirname, "./db.json"), JSON.stringify(db, null, 2));
}

const config = {
	bot,
	db,
};

export default config;
