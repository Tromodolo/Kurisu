var exports = module.exports = {};

const util = require("util"),
	  config = require("../../bot.js").config,
	  client = require("../../bot.js").client; //Not used but needed for eval ease of use

exports.function = async (msg, args) => {
	if(msg.author.id == config.ownerId){
		let before = Date.now();
		
		try {
			let evald = eval(args.join(" "));
			evald = util.inspect(evald, { depth: 0 });
	
			if (evald && evald.length > 1800) evald = evald.substring(0, 1800);
			let after = Date.now();
			let retStr = "```javascript\n" +
				`Input: ${args.join(" ")}\n` +
				`Output: ${evald}\n` +
				`Time: ${(after - before).toFixed(3)} ms\`\`\``;
	
			return retStr;
		} catch (err) {
			let after = Date.now();
	
			let retStr = "```javascript\n" +
				`Input: ${args.join(" ")}\n` +
				`Error: ${err}\n` +
				`Time: ${(after - before).toFixed(3)} ms\`\`\``;
	
			return retStr;
		}
	}
};

exports.description = "Evaluates input";
exports.fullDescription = "Evaluates javascript input you give the bot";
exports.usage = "";
