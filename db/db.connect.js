const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGO_URI;

const initialiseDB = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Database connection successfull!"))
    .catch((err) => console.error("Error connecting to database", err.message));
};

module.exports = { initialiseDB };
