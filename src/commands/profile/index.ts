import KurisuModule from "../../models/CommandModule";

import Description from "./description";
import Profile from "./profile";
import Title from "./title";

export default new KurisuModule (
	"Profile",
	[],
	[
		Description,
		Profile,
		Title,
	],
);
