// Import everything from express and assign it to the express variable
import bodyParser from "body-parser";
import express from "express";
import db from "../db";
import {UserController} from "./controllers";

// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const port: number = 7600;
// parse application/json
app.use(bodyParser.json());

// Api routes
app.use("/api/user", UserController);

// Serve the application at the given port
app.listen(port, () => {
	// Success callback
	console.log(`Listening at http://localhost:${port}/`);
});