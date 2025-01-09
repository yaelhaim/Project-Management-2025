"use strict";

//implementing what happens when clicking on the 'but now' button
const button_buy_now = document.querySelector(".buy-now");
console.log(button_buy_now);

button_buy_now.addEventListener("click", () => {
  alert(
    "The purchase module is still under construction, thank you for your patience!"
  );
});

//when clicking on the 'information brochure' link the brochure wiil be open
function openPDF() {
  const pdfUrl = "Mockup_4.pdf";
  var pdfOverlay = document.getElementById("pdf-overlay");
  var canvas = document.getElementById("pdf-canvas");

  if (!pdfOverlay || !canvas) {
    console.error("One or more elements are missing!");
    return;
  }

  pdfOverlay.style.display = "block";

  pdfjsLib
    .getDocument(pdfUrl)
    .promise.then(function (pdf) {
      pdf.getPage(1).then(function (page) {
        var viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport,
        };
        page.render(renderContext);
      });
    })
    .catch(function (error) {
      console.error("Error loading PDF:", error);
    });
}

function closePDF() {
  var pdfOverlay = document.getElementById("pdf-overlay");
  pdfOverlay.style.display = "none";
}

// Implementing the click action on the copy link icon
document.addEventListener("DOMContentLoaded", () => {
  const copyLinkIcon = document.querySelector(".copy-link");

  if (copyLinkIcon) {
    copyLinkIcon.addEventListener("click", () => {
      // השגת הקישור הנוכחי של העמוד
      const pageUrl = window.location.href;

      // העתקת הקישור ללוח
      navigator.clipboard
        .writeText(pageUrl)
        .then(() => {
          alert("Link copied successfully");
        })
        .catch((err) => {
          console.error("Error copying link:", err);
          alert("We were unable to copy the link.");
        });
    });
  }
});

//implementing the changing icon after clicking on the copy icon
function copyLinkChange(icon) {
  icon.textContent = "check"; // שינוי לאייקון V
  icon.classList.add("check-icon"); // הוספת עיצוב ירוק
  icon.title = "Copied"; // עדכון הטייטל
}

//implemeting the adding review action
const addReviewIcon = document.querySelector(".add-reaction-icon");
const reviewModal = document.getElementById("reviewModal");
const cancelBtn = document.getElementById("cancelBtn");
const approveBtn = document.getElementById("approveBtn");
const contentTextarea = document.getElementById("content");

function clearContent() {
  contentTextarea.value = ""; //cleaning the text area
}

addReviewIcon.addEventListener("click", () => {
  reviewModal.style.display = "flex"; //showing the pop window
});

cancelBtn.addEventListener("click", function () {
  reviewModal.style.display = "none"; //hiding the pop window by clicking on the cancel button
  clearContent();
});

approveBtn.addEventListener("click", function () {
  const content = document.getElementById("content").value;
  if (content.length > 0 && content.length <= 500) {
    console.log("Review approved:", content);
    //TODO: add the review to the data base
    alert("The review has been successfully added");
    reviewModal.style.display = "none"; // if the content the customer filled is correct then closing the pop window
    clearContent();
  } else {
    alert("Content exceed the maximum number of characters allowed");
  }
});

// async function getProducts() {
//   const response = await fetch("http://localhost:3000/api/products");
//   const products = await response.json(); // קבלת הנתונים כ-JSON
//   console.log("Products from server:", products);
// }
// getProducts();

let products = [];

// פונקציה לעדכון שדות המוצר
async function updateProductDetails(productId) {
  try {
    // קריאה ל-API לקבלת פרטי המוצר לפי מזהה
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product details");

    const product = await response.json();

    // עדכון שם המוצר
    document.querySelector(".product-header h1").textContent = product.name;

    // עדכון מספר קטלוגי
    document.querySelector(
      ".product-header .catalog-number"
    ).textContent = `Catalog number: ${product.catalogNumber}`;

    // עדכון מספר רכישות
    document.querySelector(
      ".product-header .number-of-purchases"
    ).textContent = `Number of purchases: ${product.purchases}`;

    // עדכון מחיר
    const originalPriceElement = document.querySelector(
      ".price-rating #original-price"
    );
    const discountedPriceElement = document.querySelector(
      ".price-rating #discounted-price"
    );

    originalPriceElement.textContent = `${product.price} ₪`;
    if (product.discountPrice) {
      discountedPriceElement.textContent = `${product.discountPrice} ₪`;
      discountedPriceElement.style.display = "inline";
    } else {
      discountedPriceElement.style.display = "none";
    }

    // עדכון חוברת המידע (הצגת ה-PDF)
    const pdfEmbedElement = document.querySelector("#pdf-container embed");

    if (product.pdfLink) {
      // עדכון ה-src של ה-embed לקישור ה-PDF
      pdfEmbedElement.src = product.pdfLink;

      // אם ה-PDF קיים, נוודא שה-overlay שמכיל את ה-PDF מוצג
      document.getElementById("pdf-overlay").style.display = "block";
    } else {
      // אם אין קישור לפד"פ, נסתר את ה-overlay
      document.getElementById("pdf-overlay").style.display = "none";
    }

    // עדכון דירוג
    document.querySelector(
      ".product-details .rating"
    ).textContent = `Rating: ${product.rating}`;

    // עדכון תמונת המוצר
    document.querySelector(".product-image").src = product.imageUrl;

    // עדכון תיאור המוצר
    document.querySelector(".product-description").textContent =
      product.description;
  } catch (error) {
    console.error("Error updating product details:", error);
  }
}

// קבלת מזהה המוצר מה-URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id"); // מזהה המוצר

// אם יש מזהה, נטעין את המוצר
if (productId) {
  updateProductDetails(productId);
} else {
  console.error("Product ID not found in the URL");
}

// // קריאת הפונקציה כשנטען העמוד
// document.addEventListener("DOMContentLoaded", fetchProducts);

// const productVariables = {}; // אובייקט שיאחסן את המשתנים
// products.forEach((product, index) => {
//   productVariables[`product${index + 1}`] = {
//     // catalogNumber: product.catalogNumber,
//     id: product.id,
//     name: product.name,
//     price: product.price,
//     imageUrl: product.imageUrl,
//     categoryNumber: product.categoryNumber,
//     description: product.description,
//     pdfLink: product.pdfLink,
//   };
// });
