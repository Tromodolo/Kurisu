import { Client, Message, TextableChannel } from "eris";
import { EventEmitter } from "events";

export default class ResponseListener extends EventEmitter{
	public static waitForMessage(client: Client, channel: TextableChannel, userId?: string, time?: number): Promise<Message>{
		return new Promise((resolve, reject) => {
			const handleMessage = (message: Message) => {
				if (message.channel.id === channel?.id){
					if (userId){
						if (userId === message.author.id){
							client.off("messageCreate", handleMessage);
							return resolve(message);
						}
					}
					else{
						client.off("messageCreate", handleMessage);
						return resolve(message);
					}
				}
			};

			client.on("messageCreate", handleMessage);

			if (time){
				setTimeout(() => {
					client.off("messageCreate", handleMessage);
					return reject();
				}, time);
			}
		});
	}
}