// import pkg from "pg";
// const { Client } = pkg;
// import fs from "fs";
// import path from "path";

// // Database connection details
// const connectionDetails = {
//   user: "zohar",
//   host: "dpg-cu3vl3rqf0us73bugfkg-a.frankfurt-postgres.render.com",
//   database: "products_database_yuei",
//   password: "OKxKiuXWzkEzZI6lGPwXJ3kcYrUMmhe1",
//   port: 5432,
//   ssl: true,
// };

// const db = new Client(connectionDetails);

// const initializeDatabase = async () => {
//   try {
//     await db.connect();
//     console.log("Connected to the database!");

//     // Create categories table
//     await db.query(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id SERIAL PRIMARY KEY,
//         name TEXT NOT NULL,
//         description TEXT NOT NULL,
//         image_url TEXT NOT NULL,
//         products_number INTEGER NOT NULL
//       );
//     `);
//     console.log("Table 'categories' created!");

//     // Create products table
//     await db.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name TEXT NOT NULL,
//         price NUMERIC(10, 2) NOT NULL,
//         image_url TEXT NOT NULL,
//         category_id INTEGER NOT NULL REFERENCES categories(id),
//         description TEXT NOT NULL,
//         pdf_url TEXT NOT NULL,
//         catalog_number TEXT NOT NULL,
//         discount_price NUMERIC(10, 2),
//         rating NUMERIC(3, 2) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         rating_friendly NUMERIC(3, 2) NOT NULL,
//         rating_security NUMERIC(3, 2) NOT NULL,
//         number_of_purchases INTEGER NOT NULL,
//         os_support TEXT
//       );
//     `);
//     console.log("Table 'products' created!");

//     console.log("Database initialized successfully!");

//     // Load initial data from SQL file
//     const sqlFilePath = path.resolve("products_database_file.sql"); // Update with the actual path to your SQL file
//     const sql = fs.readFileSync(sqlFilePath, "utf8");

//     await db.query(sql);
//     console.log("Initial data loaded successfully!");
//   } catch (error) {
//     console.error("Error initializing database:", error.stack);
//   } finally {
//     await db.end();
//     console.log("Database connection closed.");
//   }
// };

// initializeDatabase();
