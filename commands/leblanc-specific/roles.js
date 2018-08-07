var exports = module.exports = {};

const client = require("../../bot.js").client,
	  db = require("../../db");

exports.aliases = [
    "rolelist"
];
exports.description = "Shows autoassign role menu";
exports.fullDescription = "Shows autoassign role menu";
exports.usage = "";
exports.requirements = {
    permissions: {
        "manageGuild": true
    }
}

exports.function = async (msg, args) => {
    let description = "**List of Self-Assignable Roles:\n**\n";

    let rolescommand = await db.AssignRoles.findAll({ raw: true });

    description += "React to this message with these emotes to receive a role.\nUnreact to remove a role you already have.\n\n";

    rolescommand.forEach((e) =>{
        description += "<:" + e.emotename + ":" + e.emoteid + "> - " + e.description + "\n";
    })

    let reactMessage = await client.createMessage(msg.channel.id, {
        "embed": {
            "description": description,
            "color": 0xff4141
        }
    });
    
    await db.Config.update({
        reactionmessageid: reactMessage.id
    },
    {
        where:{
            id: 1
        }
    });

    rolescommand.forEach( (e) =>{
        let reactionid = e.emotename + ":" + e.emoteid;
        reactMessage.addReaction(reactionid);
    })
}