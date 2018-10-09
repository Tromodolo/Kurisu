// Import only what we need from express
import { Request, Response, Router } from "express";
import * as db from "../../db";

// Assign router to the express.Router() instance
const router: Router = Router();

// The / here corresponds to the route that the WelcomeController
// is mounted on in the server.ts file.
// In this case it's /welcome
router.post("/experience", (req: Request, res: Response) => {
	// Reply with a hello world when no name param is provided
	res.send("test");
});

// Export the express.Router() instance to be used by server.ts
export const UserController: Router = router;