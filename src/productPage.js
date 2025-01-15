"use strict";

//implementing what happens when clicking on the 'but now' button
const button_buy_now = document.querySelector(".buy-now");
console.log(button_buy_now);

button_buy_now.addEventListener("click", () => {
  alert(
    "The purchase module is still under construction, thank you for your patience!"
  );
});

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

document.addEventListener("DOMContentLoaded", () => {
  // איתור אלמנטים
  const leftButton = document.querySelector(".nav-button.left-button");
  const rightButton = document.querySelector(".nav-button.right-button");
  const reviewContainer = document.querySelector(".review-container .review");
  const addReactionIcon = document.querySelector(".actions .add_reaction");
  const deleteIcon = document.querySelector(".actions .delete");
  const rateReviewIcon = document.querySelector(".actions .rate_review");

  // רשימת ביקורות לדוגמה (ניתן להחליף בנתונים מהשרת)
  const reviews = [
    {
      title: "Best software ever!",
      content: "Amazing functionality and support.",
    },
    {
      title: "Not bad",
      content: "Good value for the price, but room for improvement.",
    },
    {
      title: "Could be better",
      content: "Missing some key features I expected.",
    },
  ];

  let currentReviewIndex = 0;

  // עדכון תוכן הביקורת בתצוגה
  function updateReviewDisplay() {
    const review = reviews[currentReviewIndex];
    if (review) {
      reviewContainer.querySelector("h1").textContent = review.title;
      reviewContainer.querySelector("p").textContent = review.content;
    }
  }

  // אירוע דפדוף שמאלה
  if (leftButton) {
    leftButton.addEventListener("click", () => {
      currentReviewIndex =
        (currentReviewIndex - 1 + reviews.length) % reviews.length;
      updateReviewDisplay();
    });
  }

  // אירוע דפדוף ימינה (במידה ויש כפתור כזה בעתיד)
  if (rightButton) {
    rightButton.addEventListener("click", () => {
      currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
      updateReviewDisplay();
    });
  }

  // פעולה על כפתור 'rate_review'
  if (rateReviewIcon) {
    rateReviewIcon.addEventListener("click", () => {
      alert("Opening review modal...");
      // ניתן להוסיף פונקציונליות לפתיחת חלון ביקורת
    });
  }

  // פעולה על כפתור 'delete'
  if (deleteIcon) {
    deleteIcon.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this review?"
      );
      if (confirmDelete) {
        reviews.splice(currentReviewIndex, 1); // מחיקת הביקורת מהרשימה
        currentReviewIndex = Math.min(currentReviewIndex, reviews.length - 1); // עדכון אינדקס
        updateReviewDisplay();
      }
    });
  }

  // פעולה על כפתור 'add_reaction'
  if (addReactionIcon) {
    addReactionIcon.addEventListener("click", () => {
      alert("Reaction added!");
      // ניתן להוסיף לוגיקה נוספת להוספת תגובה
    });
  }

  // טעינת הביקורת הראשונה בעת פתיחת הדף
  updateReviewDisplay();
});

// //implemeting the adding review action
// const addReviewIcon = document.querySelector(".add-reaction-icon");
// const reviewModal = document.getElementById("reviewModal");
// const cancelBtn = document.getElementById("cancelBtn");
// const approveBtn = document.getElementById("approveBtn");
// const contentTextarea = document.getElementById("content");

// function clearContent() {
//   contentTextarea.value = ""; //cleaning the text area
// }

// addReviewIcon.addEventListener("click", () => {
//   reviewModal.style.display = "flex"; //showing the pop window
// });

// cancelBtn.addEventListener("click", function () {
//   reviewModal.style.display = "none"; //hiding the pop window by clicking on the cancel button
//   clearContent();
// });

// approveBtn.addEventListener("click", function () {
//   const content = document.getElementById("content").value;
//   if (content.length > 0 && content.length <= 500) {
//     console.log("Review approved:", content);
//     //TODO: add the review to the data base
//     alert("The review has been successfully added");
//     reviewModal.style.display = "none"; // if the content the customer filled is correct then closing the pop window
//     clearContent();
//   } else {
//     alert("Content exceed the maximum number of characters allowed");
//   }
// });

// async function getProducts() {
//   const response = await fetch("http://localhost:3000/api/products");
//   const products = await response.json(); // קבלת הנתונים כ-JSON
//   console.log("Products from server:", products);
// }
// getProducts();

let products = [];
let product_pdf_url = " ";

// פונקציה לעדכון שדות המוצר
async function updateProductDetails(productId) {
  try {
    // קריאה ל-API לקבלת פרטי המוצר לפי מזהה
    const response = await fetch(`/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product details");

    const product = await response.json();
    console.log(product);

    // עדכון שם המוצר
    document.querySelector(".product-header h1").textContent = product.name;

    // עדכון מספר קטלוגי
    document.querySelector(
      ".product-header .catalog-number"
    ).textContent = `Catalog number: ${product.catalog_number}`;

    // עדכון מספר רכישות
    document.querySelector(
      ".product-header .number-of-purchases"
    ).textContent = `Number of purchases: ${product.number_of_purchases}`;

    // עדכון מחיר
    const originalPriceElement = document.querySelector(
      ".price-rating #original-price"
    );
    const discountedPriceElement = document.querySelector(
      ".price-rating #discounted-price"
    );

    originalPriceElement.textContent = `${product.price} ₪`;
    if (product.discountPrice) {
      discountedPriceElement.textContent = `${product.discount_price} ₪`;
      discountedPriceElement.style.display = "inline";
      originalPriceElement.style.display = "inline";
    } else {
      discountedPriceElement.style.display = "none";
    }

    product_pdf_url = product.pdf_url;

    // מצא את אלמנט הכוכבים
    const ratingContainer = document.querySelector(".rating");

    // קבל את כל אלמנטי הכוכבים
    const stars = ratingContainer.querySelectorAll(
      ".material-symbols-outlined"
    );

    // השאר רק את הכוכבים שצריך (לפי הדירוג)
    stars.forEach((star, index) => {
      if (index >= product.rating) {
        star.remove(); // הסר כוכבים מיותרים
      }
    });

    // עדכון תמונת המוצר
    document.querySelector(".product-image").src = product.image_url;

    // עדכון תיאור המוצר
    document.querySelector(".product-description p").textContent =
      product.description;

    // מעדכנים את התמנה הראשית
    document.querySelector(".main-product-image img").src = product.image_url;
  } catch (error) {
    console.error("Error updating product details:", error);
  }
}

// קבלת מזהה המוצר מה-URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId"); // מזהה המוצר
console.log(productId);

// אם יש מזהה, נטעין את המוצר
if (productId) {
  updateProductDetails(productId);
} else {
  console.error("Product ID not found in the URL");
}

// מניחים שמידע המוצר כבר טוען והשתמשנו ב-openPDF עם כתובת ה-PDF
function openPDF() {
  const pdfOverlay = document.getElementById("pdf-overlay");
  const pdfEmbed = document.getElementById("pdf-embed");

  pdfEmbed.src = product_pdf_url; // עדכון ה-src של ה-embed עם ה-URL של ה-PDF
  pdfOverlay.style.display = "flex"; // הצגת ה-overlay עם ה-PDF

  pdfjsLib
    .getDocument(product_pdf_url)
    .promise.then(function (pdf) {
      pdf.getPage(1).then(function (page) {
        const viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
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

// סגירת ה-PDF
function closePDF() {
  const pdfOverlay = document.getElementById("pdf-overlay");
  pdfOverlay.style.display = "none"; // הסתרת ה-overlay
}

// מאזין לאירוע על הקישור של חוברת המידע
document
  .getElementById("brochure-link")
  .addEventListener("click", function (event) {
    event.preventDefault(); // מונע את הפעולה המוגדרת ב-href (#)

    // כאן אתה שולף את הקישור ל-PDF ממקור כלשהו, לדוגמה:
    const productPdfUrl = product_pdf_url; // הזן את ה-URL המתאים

    openPDF(); // קריאה לפונקציה עם ה-URL של ה-PDF
  });
