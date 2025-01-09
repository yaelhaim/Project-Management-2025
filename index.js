import express from "express";
import dotenv from "dotenv";
import pkg from "pg"; // ייבוא ברירת המחדל של החבילה
const { Pool } = pkg;

const app = express();
const PORT = 3000;

app.use(express.static("public"));

dotenv.config();

// הגדרות חיבור ל-PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || "products_database",
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to database successfully!");
    return client
      .query("SELECT current_database();") // בדיקה לאיזה בסיס נתונים מחוברים
      .then((res) => {
        console.log("Connected to database:", res.rows[0].current_database);
        client.release();
      });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.stack);
  });

//שליפת המוצרים מהבסיס נתונים בצורה של רשימה ובה כל המוצרים, כל מוצר יכיל את כל השדות שלו
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const products = result.rows.map((row) => {
      const {
        id,
        name,
        price,
        image_link,
        category_id,
        description,
        pdf_link,
        catalog_number,
        discount_price,
        rating,
      } = row;

      return {
        id,
        name,
        price,
        image_link,
        category_id,
        description,
        pdf_link,
        catalog_number,
        discount_price,
        rating,
      };
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

//הוספת מוצר לבסיס נתונים
app.post("/api/products", express.json(), async (req, res) => {
  const {
    name,
    price,
    image_url,
    category_id,
    description,
    pdf_url,
    catalog_number,
    discount_price,
    rating,
  } = req.body;

  if (
    !name ||
    !price ||
    !image_url ||
    !category_id ||
    !description ||
    !pdf_url ||
    !catalog_number ||
    !discount_price ||
    !rating
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO products (name,price,image_url, category_id, description, pdf_url) VALUES ($1, $2, $3) RETURNING *",
      [
        name,
        price,
        image_url,
        category_id,
        description,
        pdf_url,
        catalog_number,
        discount_price,
        rating,
      ]
    );
    res.status(201).json(result.rows[0]); // החזרת המוצר החדש
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

app.use(express.static("src"));

// מסלול ראשי שיגיש את הדף הראשי
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/homePage.HTML");
});

// מסלול ראשי שיגיש את דף המוצר
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/productPage.HTML");
});

// מסלול ראשי שיגיש את דף המוצרים האהובים
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/favorite_productsPage.HTML");
});

app.listen(PORT, () => {
  console.groupCollapsed("Listening on port", PORT);
});
