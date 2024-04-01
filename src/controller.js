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
  editGuest: async (req, res) => {
    const { id } = req.params;
    const { name, message } = req.body;

    if (!name && !message) {
      return res.status(400).json({ error: "Name or message is required" });
    }

    try {
      const querySelect = "SELECT * FROM guests WHERE id = $1";
      const { rows } = await pool.query(querySelect, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Guest not found" });
      }

      const updatedGuest = {
        name: name || rows[0].name,
        message: message || rows[0].message,
      };

      const queryUpdate =
        "UPDATE guests SET name = $1, message = $2 WHERE id = $3 RETURNING *";
      const values = [updatedGuest.name, updatedGuest.message, id];
      const result = await pool.query(queryUpdate, values);

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating guest:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteGuest: async (req, res) => {
    const { id } = req.params;

    try {
      const query = "DELETE FROM guests WHERE id = $1 RETURNING *";
      const values = [id];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Guest not found" });
      }
      res.json({ message: "Guest deleted successfully" });
    } catch (error) {
      console.error("Error deleting guest:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
