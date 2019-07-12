import { Message, Client, Emoji } from "eris";
import Command from "../../models/Command";
import { DatabaseHandler } from "../../handlers";
import { DiscordEmbed } from "../../utility/DiscordEmbed";

import * as config from "../../config";
import { ReactionHandler } from "../../handlers/ReactionHandler";
import { UserAchievement } from "../../database/models/UserAchievement";
import { Achievement } from "../../database/models/Achievement";

enum MessageReactions {
	LeftButton = "⬅",
	RightButton = "➡",
}

export default class Achievements extends Command {
	constructor(){
		super();
		this.commandName = "achievements";
		this.aliases = [];
		this.description = "Show list of achievements";
		this.fullDescription = "Show list of achievements";
		this.usage = "achievements";

		// const requirements: new Object();
		this.requirements = [];
		this.deleteCommand = false;
	}

	public commandFunc(message: Message, args: string[], db: DatabaseHandler, bot: Client) {
		return new Promise(async (resolve) => {
			const user = await db.getOrCreateUser(message.member!);
			const earned = user.earnedAchievements;
			let page = 0;

			let achievements = await db.achievementRepo.find({
				where: {
					hidden: false,
				},
			});

			achievements = achievements.filter((y) => !earned.map((x) => x.id).includes(y.id));
			const achievementPages = getAchievementPages(earned, achievements);

			const embed = new DiscordEmbed();
			embed.setAuthor("List of Achievements:", "", bot.user.avatarURL);
			embed.setColor(parseInt(config.default.bot.color));
			embed.setDescription(achievementPages[page]);
			embed.setFooter("", `Page ${page + 1}/${achievementPages.length}`);

			const sentMessage = await message.channel.createMessage(embed.getEmbed());

			await sentMessage.addReaction(MessageReactions.LeftButton);
			await sentMessage.addReaction(MessageReactions.RightButton);

			const reactions = new ReactionHandler(bot, sentMessage, 120 * 1000);
			reactions.on("reactionAdd", (msg: Message, emoji: Emoji, userId: string) => {
				const reactUser = msg.member!.guild.members.get(userId);
				if (!reactUser || reactUser.bot){
					return;
				}

				switch (emoji.name){
					case MessageReactions.LeftButton:
						if (page - 1 < 0){
							return;
						}
						page--;
						break;
					case MessageReactions.RightButton:
						if (page + 1 > achievementPages.length - 1){
							return;
						}
						page++;
						break;
					default:
						return;
				}

				embed.setDescription(achievementPages[page]);
				embed.setFooter("", `Page ${page + 1}/${achievementPages.length}`);
				sentMessage.edit(embed.getEmbed());
			});

			return resolve();
		});
	}
}

function getAchievementPages(earned: UserAchievement[], notEarned: Achievement[]): string[]{
	let pageString = ``;
	const pages: string[] = [];

	pageString += `:star2: **Earned Achievements:**
`;

	for (const ach of earned){
		const achievementMsg = `- **${ach.achievement.name}**
_${ach.achievement.showDescription ? ach.achievement.description : "Unlock requirement hidden"}_

`;
		if (pageString.length + achievementMsg.length > 500){
			pages.push(pageString);
			pageString = ``;
		}
		pageString += achievementMsg;
	}

	pageString += `:question: **Not Earned Achievements:**`;

	for(const ach of notEarned){
		const achievementMsg = `
- **${ach.name}**
_${ach.showDescription ? ach.description : "Unlock requirement hidden"}_
`;
		if (pageString.length + achievementMsg.length > 500){
			pages.push(pageString);
			pageString = ``;
		}
		pageString += achievementMsg;
	}

	pages.push(pageString);
	return pages;
}