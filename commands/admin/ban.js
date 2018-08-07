var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
      DiscordEmbed = require("../../utility/DiscordEmbed"),
      getUserByMessage = require("../../utility/Utility").getUserByMessage,
      getHighestRole = require("../../utility/Utility").getHighestRole;
	
exports.function = async (msg, args) => {
    let botMember = msg.channel.guild.members.get(client.user.id);

    if(!botMember.permission.json.banMembers) return "I don't have permission to ban";
 
	let user;
    
	user = getUserByMessage(msg, args);
    
    if(args.length > 0) args.splice(0, 1);

	if(!user) return "User was not found";
    
    if(user.id == msg.member.id) return "You can't ban yourself";
    if(user.id == msg.channel.guild.ownerID) return "You can't ban the owner of a server";
    
    let botRole = getHighestRole(msg.channel.guild, botMember);
    let targetRole = getHighestRole(msg.channel.guild, user);
    let authorRole = getHighestRole(msg.channel.guild, msg.member)


    if(targetRole.position >= botRole.position) return "I can't ban someone with a higher role or equal role to me"
    if(authorRole.position >= botRole.position) return "You can't ban someone with a higher role than yourself"

    try{
        let reason = "Unspecified";
        let embed = new DiscordEmbed();


        if(args.length > 0) reason = args.join(" ");

        embed.setColor(color);
        embed.setDescription(`You were banned from **${msg.channel.guild.name}**`);
        embed.addField("**Reason:**", reason, true);

        let userDM = await user.user.getDMChannel();
        await userDM.createMessage(embed.getEmbed());
        await user.ban(0, reason);
    }
    catch(e){
        return "Something went wrong when banning"
    }
};

exports.description = "Shows your or another user's profile";
exports.fullDescription = "Shows your or another user's profile";
exports.usage = "<emote>";