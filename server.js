const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve public/
app.use(express.static(path.join(__dirname, "public")));

app.post("/submit", (req, res) => {
  const { full_name, email, phone_number, preferred_location, interest } =
    req.body;

  console.log("Received form data:", req.body);

  if (
    !full_name ||
    !email ||
    !phone_number ||
    !preferred_location ||
    !interest
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `
    INSERT INTO franchise_applications
    (full_name, email, phone_number, preferred_location, interest)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [full_name, email, phone_number, preferred_location, interest],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      console.log("✅ Inserted into DB:", result);
      res.json({ message: "Application submitted successfully!" });
    }
  );
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
