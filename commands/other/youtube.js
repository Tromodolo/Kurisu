var exports = module.exports = {};

const client = require("../../bot.js").client,
      color = require("../../bot.js").kurisuColour,
      google = require("googleapis").google,
	  customSearch = google.youtube({
	      version: "v3",
    	  auth: "AIzaSyD_f_HdZSjRuWsMZNPImhGy71NyLxUoi0A"
	  }),
	  DiscordEmbed = require("../../utility/DiscordEmbed");

exports.function = async (msg, args) => {
    if(args.length > 0){
        let query = args.join(" ");
        const res = await customSearch.search.list({
            part: "id,snippet",
            q: query,
        });
        
        let data = res.data;

		let embed = new DiscordEmbed();

		embed.setColor(color);
		embed.setTitle(data.items[0].snippet.title);
		embed.setUrl("https://www.youtube.com/watch?v=" + data.items[0].id.videoId);
		embed.setDescription(`${data.items[0].snippet.description}`);
		embed.setThumbnail(data.items[0].snippet.thumbnails.high.url);
		embed.setAuthor(`Youtube search for '${query}'`);
		
        client.createMessage(msg.channel.id, embed.getEmbed());
    }
    else{
        return "You need to specify a search term"
    }

};

exports.description = "Looks up a term on youtube";
exports.fullDescription = "Looks up a term on youtube";
exports.usage = "<search term>";