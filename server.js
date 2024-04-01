require("dotenv").config();
const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const app = express();
const {
  postGuest,
  getGuests,
  editGuest,
  deleteGuest,
} = require("./src/controller");
const { PORT, DATABASE_URL } = process.env;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

app.use(express.json());
app.use(
  cors({
    origin: ["https://tlwaller.github.io", "http://localhost:3000"],
    methods: ["GET", "POST"], // Add other methods if needed
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

app.post("/", postGuest);
app.get("/", getGuests);
app.put("/:id", editGuest);
app.delete("/:id", deleteGuest);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/guest-list");
