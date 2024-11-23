// Maurissa Higgins
// maukhigs@iastate.edu
// November 16th, 2024

var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");
var multer = require("multer");
const { MongoClient } = require("mongodb");

// MySQL
const mysql = require("mysql2");
const mysqldb = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "@Dolfino1",
  database: "secoms3190",
});

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

const port = "8081";
const host = "localhost";
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms3190";
const client = new MongoClient(url);
const db = client.db(dbName);

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });
// Create "uploads" folder if it doesn't exist
// const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.get("/contact", (req, res) => {
  try {
    mysqldb.query("SELECT * FROM contact", (err, result) => {
      if (err) {
        console.error({ error: "Error reading all posts:" + err });
        return res
          .status(500)
          .send({ error: "Error reading all contacts" + err });
      }
      res.status(200).send(result);
    });
  } catch (err) {
    console.error({ error: "An unexpected error occurred" + err });
    res.status(500).send({ error: "An unexpected error occurred" + err });
  }
});

app.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  console.log("Robot to find :", id);
  await client.connect();
  console.log("Node connected successfully to GET-id MongoDB");
  const query = { id: id };
  const results = await db.collection("robot").findOne(query);
  console.log("Results :", results);
  if (!results) res.send("Not Found").status(404);
  else res.send(results).status(200);
});

app.post("/contact", upload.single("image"), (req, res) => {
  const { contact_name, phone_number, message } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  // Step 1: Check if contact_name already exists
  const checkQuery = "SELECT * FROM contact WHERE contact_name = ?";
  db.query(checkQuery, [contact_name], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error during validation:", checkErr);
      return res
        .status(500)
        .send({ error: "Error checking contact name: " + checkErr.message });
    }
    if (checkResult.length > 0) {
      // If contact_name exists, send a conflict response
      return res.status(409).send({ error: "Contact name already exists." });
    }
  });
  const query =
    "INSERT INTO contact (contact_name, phone_number, message, image_url) VALUES (?, ?, ?, ?)";
  db.query(
    query,
    [contact_name, phone_number, message, imageUrl],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ error: "Error adding contact" + err });
      } else {
        res.status(201).send("Contact added successfully");
      }
    }
  );
});

app.delete("/contact/:id", (req, res) => {
  const id = req.params.id;

  try {
    const query = "DELETE FROM contact WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ err: "Error deleting contact" });
      } else if (result.affectedRows === 0) {
        res.status(404).send({ err: "Contact not found" });
      } else {
        res.status(200).send("Contact deleted successfully");
      }
    });
  } catch (err) {
    // Handle synchronous errors
    console.error("Error in DELETE /contact:", err);
    res.status(500).send({
      error: "An unexpected error occurred in DELETE: " + err.message,
    });
  }
});

app.put("/contact/:id", (req, res) => {
  const id = req.params.id;

  const query = `
UPDATE contact
SET contact_name = ?, phone_number = ?, message = ?
WHERE id = ?
`;
  db.query(query, [contact_name, phone_number, message, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ err: "Error updating contact" });
    } else if (result.affectedRows === 0) {
      res.status(404).send({ err: "Contact not found" });
    } else {
      res.status(200).send("Contact updated successfully");
    }
  });
});

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
