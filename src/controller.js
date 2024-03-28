require("dotenv").config();
const { DATABASE_URL } = process.env;
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  getGuests: async (req, res) => {
    try {
      const query = "SELECT * FROM guests";
      const rows = await pool.query(query);
      res.status(201).json(rows.rows);
    } catch (error) {
      console.error("Error fetching guest list: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  postGuest: async (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Name and/or message missing" });
    }

    try {
      const query =
        "INSERT INTO guests (name, message) VALUES ($1, $2) RETURNING *";
      const values = [name, message];
      const { rows } = await pool.query(query, values);
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error adding guest: ", error);
      res.status(500), json({ error: "Internal server error" });
    }
  },
};
