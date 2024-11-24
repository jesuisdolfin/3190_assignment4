var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");
var multer = require("multer");
const { MongoClient } = require("mongodb");
var path = require("path"); // Add path module

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
  console.log("Robot to find:", id);
  try {
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { id: id };
    const results = await db.collection("robot").findOne(query);
    console.log("Results:", results);
    if (!results) return res.status(404).send("Not Found");
    else return res.status(200).send(results);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    res.status(500).send({ error: "Error connecting to MongoDB" });
  } finally {
    await client.close();
  }
});

app.get("/contact/name", (req, res) => {
  const { contact_name } = req.query;

  try {
    // Validate if contact_name is provided
    if (!contact_name) {
      return res.status(400).send({ error: "contact_name is required" });
    }

    // Query to search for exact or partial matches, case sensitive
    const query =
      "SELECT * FROM contact WHERE LOWER(contact_name) LIKE LOWER(?)";
    const searchValue = `%${contact_name}%`; // Add wildcards for partial match
    mysqldb.query(query, [searchValue], (err, result) => {
      if (err) {
        console.error("Error fetching contacts:", err);
        return res.status(500).send({ error: "Error fetching contacts" });
      }
      res.status(200).send(result);
    });
  } catch (err) {
    console.error({
      error: "An unexpected error occurred in GET by name" + err,
    });
    res
      .status(500)
      .send({ error: "An unexpected error occurred in GET by name" + err });
  }
});

app.post("/contact", upload.single("image"), (req, res) => {
  const { contact_name, phone_number, message } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Step 1: Check if contact_name already exists
  const checkQuery = "SELECT * FROM contact WHERE contact_name = ?";
  mysqldb.query(checkQuery, [contact_name], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Database error during validation:", checkErr);
      return res
        .status(500)
        .send({ error: "Error checking contact name: " + checkErr.message });
    }
    if (checkResult.length > 0) {
      return res.status(409).send({ error: "Contact name already exists." });
    }

    // Step 2: Insert contact
    const query =
      "INSERT INTO contact (contact_name, phone_number, message, image_url) VALUES (?, ?, ?, ?)";
    mysqldb.query(
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
});

app.delete("/contact/:id", (req, res) => {
  const id = req.params.id;
  try {
    const query = "DELETE FROM contact WHERE id = ?";
    mysqldb.query(query, [id], (err, result) => {
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
    console.error("Error in DELETE /contact:", err);
    res.status(500).send({
      error: "An unexpected error occurred in DELETE: " + err.message,
    });
  }
});

app.put("/contact/:id", (req, res) => {
  const { contact_name, phone_number, message } = req.body;
  const id = req.params.id;

  try {
    const query = `
    UPDATE contact
    SET contact_name = ?, phone_number = ?, message = ?
    WHERE id = ?`;

    mysqldb.query(
      query,
      [contact_name, phone_number, message, id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ err: "Error updating contact" });
        } else if (result.affectedRows === 0) {
          res.status(404).send({ err: "Contact not found" });
        } else {
          res.status(200).send("Contact updated successfully");
        }
      }
    );
  } catch (err) {
    // Handle synchronous errors
    console.error("Error in UPDATE /contact:", err);
    res
      .status(500)
      .send({
        error: "An unexpected error occurred in UPDATE: " + err.message,
      });
  }
});

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
