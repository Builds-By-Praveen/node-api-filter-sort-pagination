import express from "express";

import routes from "../src/routes/index.js";

const app = express();

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
