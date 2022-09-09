import express from "express";
import cors from "cors";
import "./db/connection";
import path from "path";
import alerts from "./routes/alerts";
import investigation from "./routes/investigation";
import cameras from "./routes/cameras";
import myAlerts from "./routes/myAlerts";
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(path.join(`${process.cwd()}/Aksha`)));
app.use(express.static(path.join(`${process.cwd()}/Aksha`)));

function apiTimeOut(req, res, next) {
  res.setTimeout(30000);
  next();
}

app.use("/api", alerts, apiTimeOut);
app.use("/api", investigation, apiTimeOut);
app.use("/api", cameras, apiTimeOut);
app.use("/api", myAlerts, apiTimeOut);

export default app;
