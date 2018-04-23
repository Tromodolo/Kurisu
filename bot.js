const eris = require("eris"),
	fs = require("fs"),
	db = require("./db");
	
var config = require("./config.json"),
	customCommands = require("./data/customcommands.json"),
	rolesCommand = require("./data/rolescommand.json"),
	color = 0xd83e3e,
	commandList = [];

var exports = module.exports = {};
var messageTimers = [];

var bot = new eris.CommandClient(config.botToken, { getAllUsers: true }, {
	description: "A bot made with Eris",
	owner: config.ownerName,
	prefix: "!",
	defaultHelpCommand: false
});

exports.config          = config,
exports.client          = bot,
exports.customCommands  = customCommands;
exports.rolesCommand    = rolesCommand;
exports.kurisuColour    = color;
exports.commandList     = commandList;

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
	bot.editStatus({ name: "!help to see all commands"});
	db.AssignRoles.sync();
	db.Config.sync();
	db.CustomCommands.sync();
	db.UserLevels.sync();
});

bot.on("messageCreate", async (message) => {
	if(message.author.bot)
		return;

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
			await addExp(message, xpGain);
			await updateTimer(message.author.id, now); 
			
		}
		else{
			return;
		}
	} 
	else{
		await addExp(message, xpGain);        
		await addTimer(message.author.id, now);
	}
});


bot.on("messageReactionAdd", async (message, emoji, userID) =>{
	let config = await db.Config.find(
		{ 
			where:{
				id: 1
			},
			raw: true
		});

	let rolescommand = await db.AssignRoles.findAll({
		raw: true
	});
	
	if(!config.reactionmessageid){
		return;
	}
	if(message.id !== config.reactionmessageid){
		return;
	}
	else{
		var member = message.channel.guild.members.find(x => x.id == userID);
		if(member.bot){
			return;
		}
		else{
			var role = rolescommand.find(x => x.emoteid == emoji.id);
			member.addRole(role.roleid, "Roles Command");
		} 
	}
});

bot.on("messageReactionRemove", async (message, emoji, userID) =>{
	let rolescommand = await db.AssignRoles.findAll({
		raw: true
	});

	let config = await db.Config.find({ raw: true, where: { id: 1 }});

	if(!config.reactionmessageid){
		return;
	}

	if(message.id !== config.reactionmessageid){
		return;
	}
	else{
		var member = message.channel.guild.members.find(x => x.id == userID);
		if(member.bot){
			return;
		}
		else{
			var role = rolescommand.find(x => x.emoteId == emoji.id);
			if(!role){
				return;
			}
			else{
				member.removeRole(role.roleId, "Removal of role Roles Command");
			}
		}
	}
});

function checkifUserTimer( userid ){
	for (var i in messageTimers) {
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
	for (var i in messageTimers) {
		if (messageTimers[i].userid == userid) {
			messageTimers[i].time = newTime;
		}
	}
}

function getTimer( userid ){
	for (var i in messageTimers) {
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

async function addExp(message, xpGain){
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
				avatarurl: message.author.avatarURL,
				totalxp: 0,
				currentxp: 0,
				level: 0
			}
		});

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
				level: newLevel,
				currentxp: restExp,
				totalxp: db.sequelize.literal(`totalxp + ${xpGain}`),
				avatarurl: message.author.avatarURL
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
				level: newLevel,
				currentxp: db.sequelize.literal(`currentxp + ${xpGain}`),
				totalxp: db.sequelize.literal(`totalxp + ${xpGain}`),
				avatarurl: message.author.avatarURL
			}, 
			{
				where: {
					userid: message.author.id
				}
			});
	}
}

bot.connect();