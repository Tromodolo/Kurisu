var exports = module.exports = {};

const client = require("../../bot.js").client,
      color = require("../../bot.js").kurisuColour,
      google = require("googleapis").google,
	  customSearch = google.customsearch("v1"),
	  
	  DiscordEmbed = require("../../utility/DiscordEmbed");

exports.function = async (msg, args) => {
    if(args.length > 0){
        let query = args.join(" ");
        const res = await customSearch.cse.list({
            cx: "000495943812474214127:uwgvp2yysyc",
            q: query,
            auth: "AIzaSyD_f_HdZSjRuWsMZNPImhGy71NyLxUoi0A"
        });
        
        let data = res.data;

		let embed = new DiscordEmbed();

		embed.setColor(color);
		embed.setTitle(data.items[0].title);
		embed.setUrl(data.items[0].formattedUrl);
		embed.setDescription(`${data.items[0].snippet.replace("\n", " ")}\n\n*Less relevant results below*\n`);
		embed.setAuthor(`Google Search for '${query}'`);
		embed.addField(
			data.items[1].title, 
			`[Link](${data.items[1].formattedUrl}) - ${data.items[1].snippet.replace("\n", " ")}\n`,
			false
		);
		embed.addField(
			data.items[2].title, 
			`[Link](${data.items[2].formattedUrl}) - ${data.items[2].snippet.replace("\n", " ")}\n`,
			false
		);

        client.createMessage(msg.channel.id, embed.getEmbed())

    }
    else{
        return "You need to specify a search term"
    }

};

exports.description = "Googles a specified term";
exports.fullDescription = "Googles a specified term";
exports.usage = "<search term>";