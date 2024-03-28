require("dotenv").config();
const express = require("express");
const app = express();
const { Client } = require("pg");
const { getGuests, postGuest } = require("./src/controller");
const { PORT, DATABASE_URL } = process.env;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

app.use(express.json());

app.get("/", getGuests);
app.post("/", postGuest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/guest-list");
