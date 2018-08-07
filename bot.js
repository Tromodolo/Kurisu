const	eris = require("eris"),
		fs = require("fs"),
	  	db = require("./db");
	  	config = require("./config.json"),
	  	color = 0xd83e3e,
	    commandList = [],
		DiscordEmbed = require("./utility/DiscordEmbed"),
		util = require("./utility/Utility");

let bot = new eris.CommandClient(config.botToken, { getAllUsers: true }, {
	prefix: config.commandPrefix,
	defaultHelpCommand: false
});

var exports = module.exports = {};
let messageTimers = [];
let triviaList = [];

exports.config          = config,
exports.client          = bot,
exports.kurisuColour    = color;
exports.commandList     = commandList;
exports.addTrivia 		= (triviaHandler, answers, guildID) => {
	let existingIndex;
	for(let index in triviaList){
		if(triviaList[index].triviaHandler.guildID == guildID) existingIndex = index;
	}

	if(!existingIndex){
		triviaList.push({
			triviaHandler: triviaHandler,
			answers: answers,
			lastAnswerTimer: null,
			firstAnswer: null,
			usersAnswered: []
		});
		return;
	}
	else{
		triviaList[existingIndex].answers = answers;
		triviaList[existingIndex].triviaHandler.active = true;
		return;
	}
}
exports.triviaList = triviaList;

//This reads all the commands from the /commands/ folder and adds them to the bot
fs.readdir("./commands/", (err, folders) => {
	folders.forEach(function(folderName){
		var loadedFiles = 0;
		fs.readdir(`./commands/${folderName}`, (err, files) => {
			var commandModule = {
				name: folderName,
				commands:[]
			};
			files.forEach(function(file){
				var commandName = file.split(".")[0];
				var props = require(`./commands/${folderName}/${file}`);
				loadedFiles++;
				commandModule.commands.push(
					{
						name: commandName,
						description: props.fullDescription,
						usage: props.usage
					});
				bot.registerCommand(commandName, props.function, 
					{
						description: props.description,
						fullDescription: props.fullDescription,
						usage: props.usage,
					});
			});
			commandList.push(commandModule);
			console.log(`Loaded ${loadedFiles} commands in module ${folderName}`);    
			
			commandList.sort(function(a, b){
				if (a.name < b.name)
					return -1;
				if (a.name > b.name)
					return 1;
				return 0;
			});
		});
	});    
});

bot.on("ready", () => { // When the bot is ready
	console.log("Successfully connected as: " + bot.user.username + "#" + bot.user.discriminator); // Log "Ready!"
	bot.editStatus({ name: config.commandPrefix + "help to see all commands"});
});

bot.on("messageCreate", async (message) => {
	if(message.author.bot)
		return;

	//Server specific stuff
	if(message.channel.guild.id == "331573354291265548"){
		if(message.content.toLowerCase().includes("discord.gg") && !(message.member.permission.json.manageMessages))
		message.delete();

		let googleRegex = /((?:Hey\s)?Kurisu (?:could you\s)?(?:please\s)?look up)\s([a-zA-Z0-9åäö].*)/gi;
		let result = googleRegex.exec(message.content);

		if(result){
			if(result.length >= 3){
				let query = result[2];

				//Remove punctuation from the end of the string
				query = query.replace(/\.|\?|\!|\,$/, "");

				if(query.toLowerCase().endsWith("on youtube")){
					//Look stuff up on youtube;
					query = query.replace(/\son youtube$/i, "");
					util.youtubeLookup(bot, message, query, true);
				}
				else{
					//do the google
					util.googleLookup(bot, message, query, true);
				}
			}
		}
	}

	//Trivia handling
	let triviaIndex;
	for(let i in triviaList){
		if(triviaList[i].triviaHandler.guildID == message.channel.guild.id && triviaList[i].triviaHandler.channelID == message.channel.id && triviaList[i].triviaHandler.active) {
			triviaIndex = i
			break;
		}
	}
	if(triviaIndex){
		switch(message.content){
			case "1":
			case "2":
			case "3":
			case "4":
				let answerIndex;
				for(var i in triviaList[triviaIndex].answers){
					if(triviaList[triviaIndex].answers[i].realAnswer == true) answerIndex = i;
				}
				if(!triviaList[triviaIndex].lastAnswerTimer){
					triviaList[triviaIndex].lastAnswerTimer = setTimeout(() => {
						bot.createMessage(triviaList[triviaIndex].triviaHandler.channelID, "Time's up");
						let correctUsers = triviaList[triviaIndex].usersAnswered.filter(x => x.answer == answerIndex);
						if(correctUsers.length == 0){
							bot.createMessage(triviaList[triviaIndex].triviaHandler.channelID, "No one got the answer right");
						}
						else if(correctUsers.length == 1){
							bot.createMessage(triviaList[triviaIndex].triviaHandler.channelID, `Only one person got it right, and it was ${triviaList[triviaIndex].firstAnswer.mention}.`);
						}
						else if(correctUsers.length > 1){
							bot.createMessage(triviaList[triviaIndex].triviaHandler.channelID, `Several people got it right, but ${triviaList[triviaIndex].firstAnswer.mention} was fastest`);
						}
						triviaList[triviaIndex].answers = null;
						triviaList[triviaIndex].lastAnswerTimer = null;
						triviaList[triviaIndex].firstAnswer = null;
						triviaList[triviaIndex].usersAnswered = [];
						triviaList[triviaIndex].triviaHandler.active = false;
					}, 15000);
				}

				if(!triviaList[triviaIndex].firstAnswer && (parseInt(message.content) - 1) == answerIndex) triviaList[triviaIndex].firstAnswer = message.member

				triviaList[triviaIndex].usersAnswered.push({
					user: message.member,
					answer: parseInt(message.content) - 1
				})
			default:
				break;
		}
	}

	//Xp handling
    let user = await db.UserLevels.findOrCreate(
    { 
        raw: true,
        where:{
            userid: message.author.id
        },
        defaults:{
            userid: message.author.id,
            username: message.author.username,
            discriminator: message.author.discriminator,
            totalxp: 0,
            currentxp: 0,
            level: 0
        }
	});
	//This is just to make sure it exists in the other database too since I'm too lazy to do it properly atm fuck it
	await db.ProfileData.findOrCreate(
	{ 
		raw: true,
		where:{
			userid: message.author.id
		},
		defaults:{
			userid: message.author.id,
			username: message.author.username,
			discriminator: message.author.discriminator,
			avatarurl: message.author.avatarURL,
			guildjoindate: message.member.joinedAt,
			countfromdate: message.member.joinedAt
		}
	});

	await db.GuildScores.findOrCreate(
		{ 
			raw: true,
			where:{
				userid: message.author.id
			},
			defaults:{
				userid: message.author.id,
				guildid: message.channel.guild.id,
				score: 0
			}
		});

    await db.ProfileData.update({
        messagessent: db.sequelize.literal(`messagessent + 1`),
        guildjoindate: message.member.joinedAt
    }, {
        where: { userid: message.author.id }
	});
	
	user[0].username = message.author.username;
	user[0].discriminator = message.author.discriminator;

	let customCommandList = await db.CustomCommands.findAll({ raw: true });
	
	let custom = customCommandList.find(x => x.commandname == message.content);
	if(custom){
		bot.createMessage(message.channel.id, custom.commandtext);        
	}

	let now = new Date();
	let xpGain = getRandomInt(15, 26);

	if(await checkifUserTimer(message.author.id)){
		let oldTime = await getTimer(message.author.id);
		if((((now - oldTime) / 1000) > 60)) {
			await addExp(user, message, xpGain);
			await updateTimer(message.author.id, now); 
			
		}
		else{
			return;
		}
	} 
	else{
		await addExp(user, message, xpGain);        
		await addTimer(message.author.id, now);
	}
});


bot.on("messageReactionAdd", async (message, emoji, userID) =>{
	let config = await db.Config.find({ raw: true, where: { id: 1 }});

	if(message.id == config.reactionmessageid){
		let rolescommand = await db.AssignRoles.findAll({
			raw: true
		});

		let member = message.channel.guild.members.find(x => x.id == userID);
		if(member.bot){
			return;
		}
		else{
			let role = rolescommand.find(x => x.emoteid == emoji.id);
			member.addRole(role.roleid, "Roles Command");
		}
	}
	else if(message.id == config.colorreactionid){
		let colours = await db.ColourRoles.findAll({
			raw: true
		});
		let member = message.channel.guild.members.find(x => x.id == userID);
		if(member.bot){
			return;
		}
		else{
			let role = colours.find(x => x.emoteid == emoji.id);
			member.addRole(role.roleid, "Colour Command");
		}
	}
	else{
		return;
	}
});

bot.on("messageReactionRemove", async (message, emoji, userID) =>{

	let config = await db.Config.find({ raw: true, where: { id: 1 }});

	if(message.id == config.reactionmessageid){
		let rolescommand = await db.AssignRoles.findAll({
			raw: true
		});

		let member = message.channel.guild.members.find(x => x.id == userID);
		if(member.bot || !member){
			return;
		}

		let role = rolescommand.find(x => x.emoteid == emoji.id);
		if(!role){
			return;
		}
		else{
			member.removeRole(role.roleid, "Removal of role Roles Command");
		}
	}
	else if(message.id == config.colorreactionid){
		let colours = await db.ColourRoles.findAll({
			raw: true
		});
		let member = message.channel.guild.members.find(x => x.id == userID);
		if(member.bot){
			return;
		}
		else{
			let role = rolescommand.find(x => x.emoteid == emoji.id);
			member.removeRole(role.roleid, "Removal of colour Command");
		}
	}
	else{
		return;
	}

});

bot.connect();

function checkifUserTimer( userid ){
	for (let i in messageTimers) {
		if (messageTimers[i].userid === userid) {
			return true;
		}
	}
	return false;
}

async function addTimer( userid, newTime ){
	await messageTimers.push({ "userid": userid, "time": newTime });
}

function updateTimer( userid, newTime){
	for (let i in messageTimers) {
		if (messageTimers[i].userid == userid) {
			messageTimers[i].time = newTime;
		}
	}
}

function getTimer( userid ){
	for (let i in messageTimers) {
		if (messageTimers[i].userid == userid) {
			return messageTimers[i].time;
		}
	}
	return null;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

async function addExp(user, message, xpGain){
	user = user[0];

	let currentlevel = user.level;
	let newLevel, restExp;
	let levelxp = ((5 * Math.pow(currentlevel, 2)) + (40 * currentlevel) + 55);
	
	//If they leveled up
	if(levelxp <= user.currentxp + xpGain){		
		//Set exp to what's left after leveling up
		restExp = xpGain + (user.currentxp - levelxp);
		//Increase level
		newLevel = currentlevel + 1;
	}

	if(newLevel && restExp){
		
		//Means they leveled up
		await db.UserLevels.update(
		{
			username: user.username,
			discriminator: user.discriminator,
			level: newLevel,
			currentxp: restExp,
			totalxp: db.sequelize.literal(`totalxp + ${xpGain}`),
		}, 
		{
			where: {
				userid: message.author.id
			}
		});
		await db.ProfileData.update(
		{
			username: user.username,
			discriminator: user.discriminator,
			avatarurl: message.author.avatarURL
		}, 
		{
			where: {
				userid: message.author.id
			}
		});

		await db.GuildScores.update(
		{
			score: db.sequelize.literal(`score + ${xpGain}`),
		}, 
		{
			where: {
				userid: message.author.id
			}
		});

		//await bot.createMessage(message.channel.id, message.author.mention + " just achieved level **" + user.level + "**!");                         
	}
	else{		
		await db.UserLevels.update(
		{
			username: user.username,
			discriminator: user.discriminator,
			level: newLevel,
			currentxp: db.sequelize.literal(`currentxp + ${xpGain}`),
			totalxp: db.sequelize.literal(`totalxp + ${xpGain}`),
		}, 
		{
			where: {
				userid: message.author.id
			}
		});
		await db.ProfileData.update(
		{
			username: user.username,
			discriminator: user.discriminator,
			avatarurl: message.author.avatarURL
		}, 
		{
			where: {
				userid: message.author.id
			}
		});

		await db.GuildScores.update(
			{
				score: db.sequelize.literal(`score + ${xpGain}`),
			}, 
			{
				where: {
					userid: message.author.id
				}
			});
	}
}

