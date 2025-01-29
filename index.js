import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Client } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.static("src"));
app.use(express.json());

const connectionDetails = {
  user: "zohar",
  host: "dpg-cu3vl3rqf0us73bugfkg-a.frankfurt-postgres.render.com",
  database: "products_database_yuei",
  password: "OKxKiuXWzkEzZI6lGPwXJ3kcYrUMmhe1",
  port: 5432,
  ssl: true,
};

console.log(connectionDetails);

// הגדרות חיבור ל-PostgreSQL
const db = new Client(connectionDetails);

db.connect()
  .then((error) => {
    console.log("Connected to database successfully!");
    return db
      .query("SELECT current_database();") // בדיקה לאיזה בסיס נתונים מחוברים
      .then((res) => {
        console.log("Connected to database:", res.rows[0].current_database);
      });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err.stack);
  });

//שליפת המוצרים מהבסיס נתונים בצורה של רשימה ובה כל המוצרים, כל מוצר יכיל את כל השדות שלו
app.get("/api/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const products = result.rows.map((row) => {
      const {
        id,
        name,
        price,
        image_url,
        category_id,
        description,
        pdf_url,
        catalog_number,
        discount_price,
        rating,
        created_at,
        rating_friendly,
        rating_security,
        number_of_purchases,
        os_support,
      } = row;

      return {
        id,
        name,
        price,
        image_url,
        category_id,
        description,
        pdf_url,
        catalog_number,
        discount_price,
        rating,
        created_at,
        rating_friendly,
        rating_security,
        number_of_purchases,
        os_support,
      };
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// שליפת טבלת הקטגוריות מהבסיס נתונים
app.get("/api/categories", async (req, res) => {
  try {
    // שאילתה לשלוף את כל הקטגוריות מהטבלה
    const result = await db.query("SELECT * FROM categories");

    // אם אין קטגוריות, נחזיר תשובה עם קוד שגיאה 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    // מפה את התוצאות לפורמט הרצוי
    const categories = result.rows.map((row) => {
      const { id, name, description, image_url, products_number } = row;

      return {
        id,
        name,
        description,
        image_url,
        products_number,
      };
    });

    // מחזירים את התוצאה כ-JSON
    res.json(categories);
  } catch (err) {
    // טיפול בשגיאות
    console.error("Error fetching categories:", err);
    res.status(500).send("Error fetching categories");
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
    created_at,
    rating_friendly,
    rating_security,
    number_of_purchases,
    os_support,
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
    !rating ||
    !created_at ||
    !rating_friendly ||
    !rating_security ||
    !number_of_purchases ||
    !os_support
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO products (name,price,image_url, category_id, description, pdf_url, catalog_number, doscount_price, rating, created_at, rating_friendly, rating_security) VALUES ($1, $2, $3) RETURNING *",
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
        created_at,
        rating_friendly,
        rating_security,
        number_of_purchases,
        os_support,
      ]
    );
    res.status(201).json(result.rows[0]); // החזרת המוצר החדש
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// Route לטיפול במוצר לפי מזהה
app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  // בדיקה אם ה-ID הוא מספר תקין
  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    // שלוף את המוצר מהמסד נתונים
    const product = await getProductById(productId);

    if (product) {
      res.json(product); // מחזיר את פרטי המוצר כ-JSON
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// פונקציה לשליפת המוצר מהבסיס נתונים לפי מספר מזהה של המוצר
async function getProductById(id) {
  try {
    // שליפה של המוצר לפי ID
    const result = await db.query("SELECT * FROM products WHERE id = $1", [id]);

    // מחזירים את המוצר הראשון מהתוצאה אם נמצא
    return result.rows[0] || null;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    throw new Error("Database query error");
  }
}

// מסלול לשליפת ביקורות לפי מזהה מוצר
app.get("/api/reviews/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await db.query(
      "SELECT review_id, review_title, review_text, user_name, customer_rating, customer_friendly_rating, customer_security_rating FROM reviews WHERE product_id = $1",
      [productId]
    );
    res.json(result.rows); // שליחת הביקורות כ-JavaScript Object Notation
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/reviews", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT review_id, review_title, review_text, user_name, product_id, customer_rating, customer_friendly_rating, customer_security_rating FROM reviews"
    );

    // אם אין ביקורות, נחזיר תשובה עם קוד שגיאה 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    // מפה את התוצאות לפורמט הרצוי
    const reviews = result.rows.map((row) => {
      const {
        review_id,
        review_title,
        review_text,
        user_name,
        product_id,
        customer_rating,
        customer_friendly_rating,
        customer_security_rating,
      } = row;

      return {
        review_id,
        review_title,
        review_text,
        user_name,
        product_id,
        customer_rating,
        customer_friendly_rating,
        customer_security_rating,
      };
    });

    // מחזירים את התוצאה כ-JSON
    res.json(reviews);
  } catch (err) {
    // טיפול בשגיאות
    console.error("Error fetching reviews:", err);
    res.status(500).send("Error fetching reviews");
  }
});

app.post("/api/reviews", express.json(), async (req, res) => {
  const {
    review_title,
    review_text,
    user_name,
    product_id,
    customer_rating,
    customer_friendly_rating,
    customer_security_rating,
  } = req.body;

  if (
    !review_title ||
    !review_text ||
    !user_name ||
    !product_id ||
    !customer_rating ||
    !customer_friendly_rating ||
    !customer_security_rating
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO reviews (review_title, review_text, user_name, product_id, customer_rating, customer_friendly_rating, customer_security_rating) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        review_title,
        review_text,
        user_name,
        product_id,
        customer_rating,
        customer_friendly_rating,
        customer_security_rating,
      ]
    );
    res.status(201).json(result.rows[0]); // החזרת המוצר החדש
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// מסלול למחיקת ביקורת
app.delete("/api/reviews/:reviewId", async (req, res) => {
  const { reviewId } = req.params; // מזהה הביקורת שמגיעה מה-URL

  try {
    // שליחת בקשת מחיקה למסד הנתונים
    const result = await db.query(
      "DELETE FROM reviews WHERE review_id = $1 RETURNING *",
      [reviewId]
    );

    if (result.rows.length === 0) {
      // אם לא נמצאה ביקורת עם מזהה זה
      return res.status(404).json({ message: "Review not found" });
    }

    // אם המחיקה הצליחה, מחזירים תשובה עם הודעה מוצלחת
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

app.put("/api/reviews/:numericReviewId", async (req, res) => {
  const reviewId = req.params.numericReviewId;
  console.log("Request body received:", req.body);
  const { review_title, review_text, customer_rating } = req.body;

  try {
    const result = await db.query(
      "UPDATE reviews SET review_title = $1, review_text = $2, customer_rating = $3 WHERE review_id = $4 RETURNING *",
      [review_title, review_text, customer_rating, reviewId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(200).json({
      message: `Review with ID ${reviewId} updated successfully`,
      review: result.rows[0],
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Failed to update review" });
  }
});

// נתיב לשליפת ביקורת לפי מזהה
app.get("/reviews/:numericReviewId", async (req, res) => {
  const reviewId = req.params.numericReviewId;

  try {
    // const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM reviews WHERE review_id = $1",
      [reviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    console.log("Query result:", result.rows);

    res.json(result.rows[0]); // החזרת הביקורת ללקוח
  } catch (err) {
    console.error("Error fetching review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// מסלול ראשי שיגיש את הדף הראשי
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/src/homePage.HTML");
// });

// // מסלול ראשי שיגיש את דף המוצר
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/src/productPage.HTML");
// });

// // מסלול ראשי שיגיש את דף המוצרים האהובים
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/src/favorite_productsPage.HTML");
// });

// app.listen(PORT, () => {
//   console.groupCollapsed("Listening on port", PORT);
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "homePage.html"));
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "homePage.html"));
});

// נתיב לדף המוצרים
app.get("/product", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "productPage.HTML"));
});

// נתיב לדף המוצרים האהובים
app.get("/favorite", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "favorite_productsPage.HTML"));
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
