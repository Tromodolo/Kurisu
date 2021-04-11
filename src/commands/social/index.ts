import KurisuModule from "../../models/CommandModule";
import { Bot } from "../../bot";

import Avatar from "./avatar";
import HighFive from "./highfive";
import Hug from "./hug";
import Pet from "./pet";
import WhoIs from "./whois";

export default new KurisuModule (
	"💬 Social",
	[],
	[
		Avatar,
		HighFive,
		Hug,
		Pet,
		WhoIs,
	],
);