import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

export default class HelpModule extends KurisuModule{
	constructor(bot: Bot){
		super(
			bot,
			"Help",
			[],
			__dirname,
		);
	}
}