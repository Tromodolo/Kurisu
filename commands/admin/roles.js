
var exports = module.exports = {},
client = require("../../bot.js").client,
db = require("../../db");

exports.function = async (msg, args) => {
if(msg.member.permission.json.administrator || msg.author.id == "123184215423582208"){
    var description = "**List of Roles:\n**\n";

    let rolescommand = await db.AssignRoles.findAll({ raw: true });

    rolescommand.forEach((e) =>{
        description += "<:" + e.emotename + ":" + e.emoteid + "> - " + e.description + "\n";
    })

    var reactMessage = await client.createMessage(msg.channel.id, {
        "embed": {
            "author": {
                "name": "Disquad",
                "url": "https://disquad.net/",
                "icon_url": "https://tromo.me/u/5a5bcebf454e5.png"
            },
            "description": description,
            "color": 16728385
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
        var reactionid = e.emotename + ":" + e.emoteid;
        reactMessage.addReaction(reactionid);
    })
}
else{
    return;
}
}

exports.description = "Shows autoassign role menu";
exports.fullDescription = "Shows autoassign role menu";
exports.usage = "";
