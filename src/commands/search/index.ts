import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

export default class SearchModule extends KurisuModule{
	constructor(bot: Bot){
		super(
			bot,
			"Search",
			[],
			__dirname,
		);
	}
}