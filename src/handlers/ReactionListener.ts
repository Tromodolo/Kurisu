import { Client, Emoji, Member, Message } from "eris";
import { EventEmitter } from "events";

export default class ReactionListener extends EventEmitter{
	public static waitForReaction(client: Client, origMessage: Message, userId?: string, time?: number): Promise<{message: Message, emoji: Emoji, user: Member | {id: string}}>{
		return new Promise((resolve, reject) => {
			const handleReaction = (newMessage: Message, emoji: Emoji, reactedUser: Member | {id: string}) => {
				if (origMessage.id === newMessage.id){
					if (userId){
						if(userId !== reactedUser.id){
							return;
						}
					}
					client.off("messageReactionAdd", handleReaction);
					return resolve({
						message: newMessage,
						emoji,
						user: reactedUser,
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