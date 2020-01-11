import { Client, Emoji, Message } from "eris";
import { EventEmitter } from "events";

export default class ReactionListener extends EventEmitter{
	public static waitForReaction(client: Client, origMessage: Message, userId?: string, time?: number): Promise<{message: Message, emoji: Emoji, userId: string}>{
		return new Promise((resolve, reject) => {
			const handleReaction = (newMessage: Message, emoji: Emoji, reactedUserId: string) => {
				if (origMessage.id === newMessage.id){
					if (userId){
						if(userId !== reactedUserId){
							return;
						}
					}
					client.off("messageReactionAdd", handleReaction);
					return resolve({
						message: newMessage,
						emoji,
						userId: reactedUserId,
					});
				}
			};

			client.on("messageReactionAdd", handleReaction);

			if (time){
				setTimeout(() => {
					client.off("messageReactionAdd", handleReaction);
					return reject();
				}, time);
			}
		});
	}
}