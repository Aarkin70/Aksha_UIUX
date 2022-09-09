import "dotenv/config";
import app from "./app";
import http from "http";
import observer from "../utils/observer";
const PORT = process.env.PORT;

const server = http.createServer(app);

observer(server, app).listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
