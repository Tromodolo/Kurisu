import { Client, Message } from "eris";
import { EventEmitter } from "events";

export default class ResponseListener extends EventEmitter{
	private client: Client;
	private _userId: string;

	constructor(client: Client, userId: string, time?: number){
		super();
		this.messageEvent = this.messageEvent.bind(this);
		this.client = client;
		this._userId = userId;

		if (time){
			this.startListening();
			setTimeout(() => this.stopListening(), time);
		}
	}

	public stopListening(){
		this.client.off("messageCreate", this.messageEvent);
		this.emit("stopListening");
	}

	public startListening(){
		this.client.on("messageCreate", this.messageEvent);
	}

	private messageEvent(message: Message){
		if (message.author.id === this._userId){
			this.emit("response", message);
		}
	}
}