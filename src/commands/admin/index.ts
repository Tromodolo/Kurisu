import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

export default class AdminModule extends KurisuModule{
	constructor(bot: Bot){
		super(
			bot,
			"Admin",
			[],
			__dirname,
		);
	}
}