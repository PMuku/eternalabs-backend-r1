import express from "express";
import config from "./config.js";
import { startPoller } from "./services/poller.js";

const app = express();
const PORT = config.PORT;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

startPoller();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
