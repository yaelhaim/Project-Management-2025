"use strict";

//implementing what happens when clicking on the 'but now' button
const button_buy_now = document.querySelector(".buy-now");
console.log(button_buy_now);

button_buy_now.addEventListener("click", () => {
  alert(
    "The purchase module is still under construction, thank you for your patience!"
  );
});

document.addEventListener("DOMContentLoaded", () => {
  const favoriteIcon = document.getElementById("upper-favorite-icon");
  console.log(favoriteIcon);

  favoriteIcon.addEventListener("click", () => {
    window.location.href = "favorite_productsPage.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const shoppingCartIcon = document.getElementById("upper-shopping-cart");
  console.log(shoppingCartIcon);

  shoppingCartIcon.addEventListener("click", () => {
    window.location.href = "shoppingCartPage.html";
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // קבלת האייקונים לפי ה-ID
  const favoriteIcon = document.getElementById("favorite-icon");
  const cartIcon = document.getElementById("cart-icon");

  // מאזין ללחיצה על אייקון האהבה
  favoriteIcon.addEventListener("click", function () {
    alert(
      "Liking a product is only for registered users.\nPlease register/Log-In to the system first"
    );
  });

  // מאזין ללחיצה על אייקון עגלת הקניות
  cartIcon.addEventListener("click", function () {
    alert(
      "Adding a product to the shopping cart is only for registered users.\nPlease register/Log-In to the system first"
    );
  });
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

const addReviewIcon = document.querySelector(".add-reaction-icon");
const reviewModal = document.getElementById("reviewModal");
const cancelBtn = document.getElementById("cancelBtn");
const approveBtn = document.getElementById("approveBtn");
const contentTextarea = document.getElementById("content");
const titleInput = document.getElementById("title");
const deleteIcons = document.querySelectorAll(".delete-review-icon");
const friendlinessStars = document.querySelectorAll(
  "#friendliness-rating .material-symbols-outlined"
);
const securityStars = document.querySelectorAll(
  "#security-rating .material-symbols-outlined"
);

const ratingStars = document.querySelectorAll(
  "#content-rating .material-symbols-outlined"
);
let selectedRating = 0;
let selectedFriendlinessRating = 0;
let selectedSecurityRating = 0;

// פונקציה לעדכון הכוכבים בהתאם לדירוג
function updateStars(rating) {
  ratingStars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = "gold"; // הדגשה בצבע זהב
    } else {
      star.style.color = "gray"; // חזרה לצבע אפור
    }
  });
}

// הוספת מאזיני אירועים לכוכבים
ratingStars.forEach((star, index) => {
  // הדגשה זמנית של הכוכבים בעת ריחוף
  star.addEventListener("mouseover", () => {
    resetStars();
    updateStars(index + 1);
  });

  // הסרת הדגשה זמנית כאשר העכבר יוצא
  star.addEventListener("mouseout", () => {
    updateStars(selectedRating);
  });

  // עדכון דירוג בעת לחיצה
  star.addEventListener("click", () => {
    selectedRating = index + 1;
    updateStars(selectedRating); // הדגשת הכוכבים הקבועה
  });
});

// פונקציה לעדכון הדירוגים הנוספים (ידידותיות ואבטחה)
function updateAdditionalStars(rating, stars) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.style.color = "gold"; // הדגשה בצבע זהב
    } else {
      star.style.color = "gray"; // חזרה לצבע אפור
    }
  });
}

// הוספת מאזיני אירועים לדירוג הידידותיות
friendlinessStars.forEach((star, index) => {
  star.addEventListener("mouseover", () => {
    updateAdditionalStars(index + 1, friendlinessStars);
  });

  star.addEventListener("mouseout", () => {
    updateAdditionalStars(selectedFriendlinessRating, friendlinessStars);
  });

  star.addEventListener("click", () => {
    selectedFriendlinessRating = index + 1;
    updateAdditionalStars(selectedFriendlinessRating, friendlinessStars);
  });
});

// הוספת מאזיני אירועים לדירוג האבטחה
securityStars.forEach((star, index) => {
  star.addEventListener("mouseover", () => {
    updateAdditionalStars(index + 1, securityStars);
  });

  star.addEventListener("mouseout", () => {
    updateAdditionalStars(selectedSecurityRating, securityStars);
  });

  star.addEventListener("click", () => {
    selectedSecurityRating = index + 1;
    updateAdditionalStars(selectedSecurityRating, securityStars);
  });
});

function resetAdditionalStars() {
  friendlinessStars.forEach((star) => {
    star.style.color = "gray"; // צבע בסיסי (אפור)
  });
  securityStars.forEach((star) => {
    star.style.color = "gray"; // צבע בסיסי (אפור)
  });
}

// פונקציה לאיפוס הדירוג
function resetStars() {
  ratingStars.forEach((star) => {
    star.style.color = "gray"; // צבע בסיסי (אפור)
  });
}

function clearContent() {
  contentTextarea.value = "";
  titleInput.value = "";
}

addReviewIcon.addEventListener("click", () => {
  reviewModal.style.display = "flex";
});

cancelBtn.addEventListener("click", function () {
  reviewModal.style.display = "none";
  clearContent();
  resetStars();
});

approveBtn.addEventListener("click", function (event) {
  const maxTitleLength = 100; // לדוגמה
  const maxContentLength = 1000;

  const titleInput = document.getElementById("title");
  const contentTextarea = document.getElementById("content");

  const title = titleInput.value;
  const content = contentTextarea.value;
  const selected_rating = selectedRating;
  const selectedFriendliness = selectedFriendlinessRating; // דירוג הידידותיות
  const selectedSecurity = selectedSecurityRating; // דירוג האבטחה

  if (title.length > maxTitleLength || content.length > maxContentLength) {
    alert(
      "Please check the length of the title or the content, it might exceed the maximum length"
    );
  } else if (
    selected_rating === 0 ||
    selectedFriendliness === 0 ||
    selectedSecurity === 0
  ) {
    alert(
      "Please select a rating for all categories before submitting the review."
    );
  } else {
    const review = {
      review_title: title,
      review_text: content,
      user_name: generateRandomUsername(), // פונקציה ליצירת שם משתמש אקראי
      product_id: getCurrentProductId(),
      customer_rating: selected_rating,
      customer_friendly_rating: selectedFriendliness,
      customer_security_rating: selectedSecurity,
    };
    resetStars(); // איפוס הכוכבים
    resetAdditionalStars();
    const reviewContainer = event.target.closest(".review-container");

    // מצא את האייקון של הוספת תגובה בתוך הקונטיינר
    const addReactionIcon = reviewContainer.querySelector(".add-reaction-icon");

    if (addReactionIcon) {
      addReactionIcon.style.display = "none"; // הסתר את האייקון
    }

    console.log("here", review);
    // שליחת הביקורת לשרת
    sendReviewToServer(review)
      .then(() => {
        alert("The review added successfully");
        reviewModal.style.display = "none";
        clearContent();
      })
      .catch((error) => {
        alert(
          "There is an error while trying to upload the review: " +
            error.message
        );
      });
  }
});

function generateRandomUsername() {
  return "user_" + Math.floor(Math.random() * 1000);
}

function getCurrentProductId() {
  return productId;
}

async function sendReviewToServer(review) {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

document.addEventListener("DOMContentLoaded", () => {
  const reviewContainer = document.querySelector(".review-container");
  const leftButton = document.querySelector(".nav-button.left-button");
  const rightButton = document.querySelector(".nav-button.right-button");
  let reviews = []; // מערך שמחזיק את הביקורות
  let currentIndex = 0; // האינדקס של הביקורת המוצגת כרגע

  // פונקציה ליצירת HTML עבור כוכבים על בסיס דירוג
  function createStarsHTML(rating) {
    let starsHTML = "";
    for (let i = 0; i < rating; i++) {
      starsHTML += `<span class="material-symbols-outlined" style="color: gold;">star</span>`;
    }
    return starsHTML;
  }

  // פונקציה ליצירת HTML עבור ביקורת
  function createReviewHTML(review) {
    if (!review) {
      return `
        <div class="no-review">
          <h1>There are no reviews for this product yet </h1>
          <p>want to be the first? 😌</p>
        </div>
      `;
    }
    return `
        <div class="review" data-review-id=${review.review_id}>
          <h1>${review.review_title}</h1>
          <p>${review.review_text}</p>
          <div class="review-footer">
            <span>${review.user_name}</span>
            <div class="review-rating">
              ${createStarsHTML(
                review.customer_rating
              )} <!-- הצגת כוכבים לפי הדירוג -->
            </div>
          </div>
        </div>
      `;
  }

  // פונקציה לעדכון הביקורת המוצגת
  function updateReviewDisplay() {
    reviewContainer.querySelector(".review-data").innerHTML = createReviewHTML(
      reviews[currentIndex]
    );
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const productId = getProductIdFromURL(); // פונקציה לקבלת מזהה מוצר מכתובת ה-URL
    const reviewContainer = document.querySelector(".review-container .review");

    try {
      const response = await fetch(`/api/reviews/${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const reviews = await response.json();

      // הוספת הביקורות לקונטיינר
      reviewContainer.innerHTML = reviews
        .map((review) => createReviewHTML(review))
        .join("");
    } catch (error) {
      console.error("Error fetching reviews:", error);
      reviewContainer.innerHTML = `<p>Can not load review</p>`;
    }
  });

  // פונקציה לדוגמה להוצאת מזהה מוצר מכתובת ה-URL
  function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("productId");
  }

  async function loadReviews() {
    const productId = getProductIdFromURL(); // קבלת מזהה מוצר
    try {
      const response = await fetch(`/api/reviews/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");

      reviews = await response.json();
      // console.log("Reviews received:", reviews);

      if (reviews.length > 0) {
        // הצגת הביקורת הראשונה אם יש ביקורות
        currentIndex = 0; // התחלה מהאינדקס הראשון
        updateReviewDisplay();
      } else {
        reviewContainer.querySelector(".review-data").innerHTML =
          createReviewHTML(null);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      reviewContainer.querySelector(
        ".review-data"
      ).innerHTML = `<pCan not load review right now</p>`;
    }
  }

  // מאזינים ללחיצה על החצים
  leftButton.addEventListener("click", () => {
    if (reviews.length > 0) {
      currentIndex = (currentIndex - 1 + reviews.length) % reviews.length; // חזרה לסוף אם מגיעים לתחילת הרשימה
      updateReviewDisplay();
    }
  });

  rightButton.addEventListener("click", () => {
    if (reviews.length > 0) {
      currentIndex = (currentIndex + 1) % reviews.length; // חזרה להתחלה אם מגיעים לסוף הרשימה
      updateReviewDisplay();
    }
  });

  // טעינת הביקורות
  loadReviews();
});

//implementing the possibility of deleting a review
document.querySelectorAll(".delete-review-icon").forEach((deleteIcon) => {
  deleteIcon.addEventListener("click", function (event) {
    // מציאת ה-review-container שמכיל את הביקורת
    const reviewContainer = event.target.closest(".review-container");
    if (!reviewContainer) {
      console.log("Review container not found");
      return;
    }
    console.log(reviewContainer);

    const reviewsC = reviewContainer.querySelector(".review-data");
    console.log(reviewsC);
    const review = reviewsC.querySelector(".review");
    console.log(review);
    const reviewId = review.getAttribute("data-review-id"); // קבלת מזהה הביקורת

    if (!reviewId) {
      console.error("Review ID is missing!");
      return;
    }

    // הצגת Modal עם שאלה אם ברצונו למחוק את הביקורת
    const modal = document.getElementById("deleteModal");
    const confirmDeleteBtn = modal.querySelector("#confirmDeleteBtn");
    const cancelDeleteBtn = modal.querySelector("#cancelDeleteBtn");

    console.log(modal); // לוודא שהמודאל נמצא
    console.log(confirmDeleteBtn);

    // הצגת ה-modal
    modal.style.display = "block";

    // אם המשתמש לוחץ על כפתור "בטוח", מחיקת הביקורת
    confirmDeleteBtn.addEventListener("click", async function () {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Review deleted successfully");
          // הסרת הביקורת מהעמוד
          review.remove();
        } else {
          alert("Error deleting review");
        }

        // סגור את ה-modal אחרי המחיקה
        modal.style.display = "none";
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting review");
        modal.style.display = "none";
      }
    });

    // אם המשתמש לוחץ על כפתור "התחרטתי", סגירת ה-modal ללא מחיקה
    cancelDeleteBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  });
});

// הגשת הטופס
document.querySelectorAll(".edit-icon").forEach((editIcon) => {
  editIcon.addEventListener("click", async function (event) {
    try {
      // מציאת ה-review-container שמכיל את הביקורת
      const reviewContainer = event.target.closest(".review-container");
      if (!reviewContainer) {
        console.error("Review container not found");
        return;
      }

      const reviewsC = reviewContainer.querySelector(".review-data");
      if (!reviewsC) {
        console.error("Review data not found");
        return;
      }

      const review = reviewsC.querySelector(".review");
      if (!review) {
        console.error("Review not found");
        return;
      }

      const reviewId = review.getAttribute("data-review-id"); // קבלת מזהה הביקורת

      if (!reviewId) {
        console.error("Review ID not found");
        return;
      }

      const numericReviewId = parseInt(reviewId, 10);

      if (isNaN(numericReviewId)) {
        console.error("Invalid review ID");
        return;
      }

      console.log(`Fetching details for review ID: ${numericReviewId}}`);

      // שליפת נתונים מהשרת
      const response = await fetch(`/reviews/${numericReviewId}`);
      console.log("sent request to server");
      if (!response.ok) {
        throw new Error("Failed to fetch review details");
      }

      const data = await response.json();
      console.log(data);

      // מילוי השדות במודל עם המידע מהשרת
      document.getElementById("edit-title").value =
        data.review_title || "No data";
      document.getElementById("edit-content").value =
        data.review_text || "No data";

      // הצגת המודל
      document.getElementById("editReviewModal").style.display = "block";
      document.getElementById("editReviewModal").style.display = "flex";

      // הוספת מאזין לכפתור Approve
      document.getElementById("editApproveBtn").onclick = async () => {
        const updatedTitle = document.getElementById("edit-title").value;
        const updatedContent = document.getElementById("edit-content").value;

        const selectedUpdatedRating = getSelectedUpdatedRating();

        try {
          const response = await fetch(`/api/reviews/${numericReviewId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              review_title: updatedTitle,
              review_text: updatedContent,
              customer_rating: selectedUpdatedRating,
            }),
          });

          if (!response.ok) throw new Error("Failed to update review");

          const result = await response.json();
          console.log("Review updated:", result);
          alert("Review updated successfully");
          document.getElementById("editReviewModal").style.display = "none";
        } catch (error) {
          console.error("Error updating review:", error);
        }
      };

      // כפתור ביטול
      document.getElementById("editCancelBtn").onclick = () => {
        document.getElementById("editReviewModal").style.display = "none";
      };
    } catch (err) {
      console.error("Error fetching review details:", err);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll("#edit-content-rating .edit-star");

  // הצגת צהוב על הכוכבים בזמן ריחוף
  stars.forEach((star, index) => {
    star.addEventListener("mouseenter", () => {
      // הדגש את כל הכוכבים עד לכוכב הנבחר בזמן הריחוף
      for (let i = 0; i <= index; i++) {
        stars[i].style.color = "gold";
      }
    });

    // החזר את הצבע לגריי כאשר העכבר יוצא
    star.addEventListener("mouseleave", () => {
      // רק אם לא נלחץ על כוכב, נשאיר את כל הצבעים אפור
      if (!star.classList.contains("selected")) {
        stars.forEach((star) => (star.style.color = "gray"));
      }
    });

    // כאשר לוחצים על כוכב, צביעה של כל הכוכבים עד לאותו כוכב
    star.addEventListener("click", () => {
      // הצבע את כל הכוכבים עד לכוכב שנבחר
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add("selected"); // הוסף class selected
        stars[i].style.color = "gold"; // צבע זהב
      }

      // הסר את ה-"selected" מהכוכבים אחרי
      for (let i = index + 1; i < stars.length; i++) {
        stars[i].classList.remove("selected"); // הסר את class selected
        stars[i].style.color = "gray"; // החזר לאפור
      }

      // שמירת הדירוג שנבחר
      console.log(`Selected rating: ${index + 1} stars`);
    });
  });
});

// פונקציה שתחשב את הדירוג הנבחר
function getSelectedUpdatedRating() {
  const stars = document.querySelectorAll("#edit-content-rating .edit-star");
  let selectedUpdatedRating = 0;

  stars.forEach((star, index) => {
    if (star.classList.contains("selected")) {
      selectedUpdatedRating = index + 1; // הדירוג יהיה לפי מספר הכוכבים שנבחרו
    }
  });

  return selectedUpdatedRating;
}

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
    const purchasesElement = document.querySelector(
      ".product-header .number-of-purchases"
    );
    if (product.number_of_purchases === 0) {
      purchasesElement.textContent = "No purchases yet";
      purchasesElement.style.color = "lightblue"; // צבע תכלת
    } else {
      purchasesElement.textContent = `Number of purchases: ${product.number_of_purchases}`;
      purchasesElement.style.color = "white"; // צבע לבן
    }

    // עדכון מחיר
    const originalPriceElement = document.querySelector(
      ".price-rating #original-price"
    );
    const discountedPriceElement = document.querySelector(
      ".price-rating #discounted-price"
    );

    // הצג את המחיר המקורי
    originalPriceElement.textContent = `${product.price} ₪`;

    // בדוק אם יש מחיר הנחה
    if (product.discount_price) {
      discountedPriceElement.textContent = `${product.discount_price} ₪`;
      discountedPriceElement.style.display = "inline"; // ודא שהמחיר המוזל מוצג
      originalPriceElement.style.textDecoration = "line-through"; // הוסף קו חוצה למחיר המקורי
      originalPriceElement.style.display = "inline"; // ודא שהמחיר המקורי מוצג
    } else {
      discountedPriceElement.style.display = "none"; // הסתר את המחיר המוזל אם אין הנחה
      originalPriceElement.style.textDecoration = "none"; // הסר קו חוצה אם אין הנחה
      originalPriceElement.style.display = "inline"; // ודא שהמחיר המקורי מוצג
    }

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

    const friendly_rating_container = document.querySelector(
      ".friendliness-ranking"
    );

    //  קבל את כל אלמנטי הכוכבים בדירוג רמת הידידותיות
    const friendly_stars = friendly_rating_container.querySelectorAll(
      ".material-symbols-outlined"
    );
    console.log(product);

    // השאר רק את הכוכבים שצריך (לפי הדירוג) בדירוג הידידותיות
    friendly_stars.forEach((star, index) => {
      if (index >= product.rating_friendly) {
        star.remove(); // הסר כוכבים מיותרים
      }
    });

    const security_ranking_container =
      document.querySelector(".security-ranking");

    //  קבל את כל אלמנטי הכוכבים בדירוג רמת הידידותיות
    const security_stars = security_ranking_container.querySelectorAll(
      ".material-symbols-outlined"
    );
    console.log(product);

    // השאר רק את הכוכבים שצריך (לפי הדירוג) בדירוג הידידותיות
    security_stars.forEach((star, index) => {
      if (index >= product.rating_security) {
        star.remove(); // הסר כוכבים מיותרים
      }
    });

    product_pdf_url = product.pdf_url;

    const operatingSystemsString = product.os_support; //the operating systems string
    const cleanedString = operatingSystemsString.replace(/[{}]/g, "");
    // המרת המחרוזת למערך על ידי פסיקים
    const operatingSystemsArray = cleanedString.split(",");

    // קבלת האלמנט שאליו נרצה לעדכן את הרשימה
    const osList = document.querySelector(".os-list");

    // ניקוי האלמנט לפני עדכון (למקרה שכבר יש תוכן)
    osList.innerHTML = "";

    // יצירת אלמנטי <p> עבור כל מערכת הפעלה ברשימה והוספתם לאלמנט
    operatingSystemsArray.forEach((os) => {
      const osItem = document.createElement("p");
      osItem.textContent = `- ${os}`; // הוספת המערכת הפעלה
      osList.appendChild(osItem); // הוספת ה-<p> לרשימה
    });
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
  // const pdfEmbed = document.getElementById("pdf-embed");
  const canvas = document.getElementById("pdf-canvas");

  // pdfEmbed.src = product_pdf_url; // עדכון ה-src של ה-embed עם ה-URL של ה-PDF
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
    console.log(productPdfUrl);

    openPDF(productPdfUrl); // קריאה לפונקציה עם ה-URL של ה-PDF
  });

const compareModule = (function () {
  let compareList = [];
  const load = () => {
    const strCompareList = sessionStorage.getItem("compareList");
    if (strCompareList) {
      compareList = JSON.parse(strCompareList);
    }
  };
  const save = () => {
    sessionStorage.setItem("compareList", JSON.stringify(compareList));
  };
  const add = (productId) => {
    if (!exists(productId) && compareList.length < 2)
      compareList.push(productId);
  };
  const remove = (productId) => {
    if (exists(productId)) {
      const index = compareList.findIndex((id) => id == productId);
      compareList.splice(index, 1);
    }
  };
  const exists = (productId) => compareList.includes(productId);
  const display = (compare) => {
    if (exists(productId)) {
      if (compareList.length == 2) {
        compare.title = "View comparison";
        compare.classList.add("view-compare");
      } else {
        compare.title = "Remove from compare";
        compare.classList.remove("view-compare");
      }
    } else {
      compare.title = "Add to compare";
      compare.classList.remove("view-compare");
    }
  };
  const handleProduct = (productId) => {
    const compare = document.getElementById("compare");
    load();
    display(compare);

    compare.addEventListener("click", function (event) {
      if (compareList.length == 2) {
        if (!compareList.includes(productId)) {
          const yesNo = confirm(
            "Cannot compare more than 2 products\nWould you like to goto the comparison page?"
          );
          if (yesNo) {
            window.location.href = "comparisonPage.html";
          }
          return;
        }
        window.location.href = "comparisonPage.html";
      } else {
        if (exists(productId)) {
          remove(productId);
        } else {
          add(productId);
        }
        display(compare);
        save();
      }
    });
  };
  return {
    handleProduct,
    save,
    add,
    remove,
    exists,
  };
})();
compareModule.handleProduct(productId);

//document.getElementById("compare")

let currentIndex = 0; // משתנה שמזכיר את המיקום הנוכחי במערך
const itemsToShow = 5; // מספר המוצרים המוצגים בכל פעם

async function fetchProducts() {
  try {
    const response = await fetch("/api/products"); // עדכן כאן עם ה-URL שלך
    const products = await response.json(); // הנחה שהנתונים מגיעים בפורמט JSON

    // מיין את המוצרים לפי מספר הרכישות מהגבוה לנמוך
    const sortedProducts = products.sort(
      (a, b) => b.purchaseCount - a.purchaseCount
    );

    // קח את 10 המוצרים הכי נמכרים
    const topProducts = sortedProducts.slice(0, 10);

    // מלא את הקונטיינר הראשון
    displayProducts(topProducts, currentIndex);

    // הוספת מאזין לאירוע לחיצה על הכפתור
    document.getElementById("nextButton").addEventListener("click", () => {
      currentIndex += itemsToShow; // הגדל את המיקום הנוכחי
      if (currentIndex >= topProducts.length) {
        currentIndex = 0; // אם הגעת לסוף, חזור להתחלה
      }
      displayProducts(topProducts, currentIndex);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function displayProducts(products, startIndex) {
  const itemsContainer = document.querySelector(".items-container");
  itemsContainer.innerHTML = ""; // לנקות את הקונטיינר לפני הוספת מוצרים

  const endIndex = Math.min(startIndex + itemsToShow, products.length);
  const productsToDisplay = products.slice(startIndex, endIndex); // קח את המוצרים להציג

  productsToDisplay.forEach((product) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    // יצירת אלמנט <a> לקישור לדף המוצר
    const linkElement = document.createElement("a");
    linkElement.href = `productPage.HTML?productId=${product.id}`;

    const imgElement = document.createElement("img");
    imgElement.classList.add("image-placeholder");
    imgElement.src = product.image_url; // הנחה שיש שדה image_url במוצר
    imgElement.alt = product.name; // הוספת טקסט חלופי לתמונה

    const priceElement = document.createElement("p");
    priceElement.classList.add("price-5-top");
    priceElement.textContent = `${product.price} ₪`; // הנחה שיש שדה price במוצר

    // הוספת התמונה והמחיר לאלמנט <a>
    linkElement.appendChild(imgElement);
    itemDiv.appendChild(linkElement); // הוספת הקישור ל-div של המוצר
    itemDiv.appendChild(priceElement);
    itemsContainer.appendChild(itemDiv);
  });
}

// קריאה לפונקציה כדי למלא את המוצרים
fetchProducts();
