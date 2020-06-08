import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.listen(3000, () => {
    console.log("Auth Service listening on port 3000");
});
