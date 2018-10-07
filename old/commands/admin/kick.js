var exports = module.exports = {};

const client = require("../../bot.js").client,
	  color = require("../../bot.js").kurisuColour,
      DiscordEmbed = require("../../utility/DiscordEmbed"),
      getUserByMessage = require("../../utility/Utility").getUserByMessage,
      getHighestRole = require("../../utility/Utility").getHighestRole;

exports.aliases = [
    "k"
];
exports.description = "Kicks a user";
exports.fullDescription = "Kicks a specified user";
exports.usage = "kick tromo";

exports.requirements = {
    permissions: {
        "kickMembers": true
    }
}

exports.function = async (msg, args) => {
    let botMember = msg.channel.guild.members.get(client.user.id);

    if(!botMember.permission.json.kickMembers) return "I don't have permission to kick";
 
	let user;
    
	user = getUserByMessage(msg, args);
    
    if(args.length > 0) args.splice(0, 1);

	if(!user) return "User was not found";
    
    if(user.id == msg.member.id) return "You can't kick yourself";
    if(user.id == msg.channel.guild.ownerID) return "You can't kick the owner of a server";
    
    let botRole = getHighestRole(msg.channel.guild, botMember);
    let targetRole = getHighestRole(msg.channel.guild, user);
    let authorRole = getHighestRole(msg.channel.guild, msg.member)


    if(targetRole.position >= botRole.position) return "I can't kick someone with a higher role or equal role to me"
    if(authorRole.position >= botRole.position) return "You can't kick someone with a higher role than yourself"

    try{
        let reason = "Unspecified";
        let embed = new DiscordEmbed();


        if(args.length > 0) reason = args.join(" ");

        embed.setColor(color);
        embed.setDescription(`You were kicked from **${msg.channel.guild.name}**`);
        embed.addField("**Reason:**", reason, true);

        let userDM = await user.user.getDMChannel();
        await userDM.createMessage(embed.getEmbed());
        await user.kick(0, reason);
    }
    catch(e){
        return "Something went wrong when kick"
    }
};