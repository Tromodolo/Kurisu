import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

export default class ProfileModule extends KurisuModule{
	constructor(bot: Bot){
		super(
			bot,
			"Profile",
			[],
			__dirname,
		);
	}
}