import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

export default class FunModule extends KurisuModule{
	constructor(bot: Bot){
		super(
			bot,
			"Fun",
			[],
			__dirname,
		);
	}
}