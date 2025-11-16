import express from "express";
import config from "./config.js";

const app = express();
const PORT = config.PORT;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
