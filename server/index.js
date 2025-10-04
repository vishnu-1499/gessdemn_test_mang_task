const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const route = require("./router/route");

const app = express();
app.use(express.json());
app.use("uploads", express.static("uploads"));
app.use(cors());
app.use("/testMng", route);

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("DB Connected...");
    app.listen(process.env.PORT, () => {
      console.log(`Server Connected to PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Failed.."));
