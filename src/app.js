import "@dotenvx/dotenvx/config";
import express from "express";

import routes from "../src/routes/index.js";

const { NODE_ENV, PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use("/", routes);

if (NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `\nServer running on http://localhost:${PORT} in ${NODE_ENV} mode\n`,
    );
  });
}

export default app;
