// הגדרת כל הפונקציות כאן
async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

let categories = [];
let selectedCategory = null; // משתנה לשמירה על הקטגוריה הנבחרת

async function loadCategories() {
    categories = await fetchData("/api/categories");
    updateCategoriesList(categories);
}

function updateCategoriesList(categories) {
    // הוספת כפתור "כל המוצרים" ראשון
    const allProductsCategory = document.createElement("div");
    allProductsCategory.classList.add("category");
    allProductsCategory.innerHTML = `
    <div class="category-circle" data-category-id="all">
      <img src="categories_images/all.png" alt="All Products" />
    </div>
    <div class="category-name">All Products</div>
  `;
    allProductsCategory.querySelector(".category-circle").addEventListener("click", () => {
        selectedCategory = null; // כל המוצרים
        loadProducts(); // טוען את כל המוצרים
    });

    const categoriesContainer = document.querySelector(".categories-container");

    // קודם כל נוסיף את כפתור "כל המוצרים"
    categoriesContainer.appendChild(allProductsCategory);

    // עכשיו נוסיף את שאר הקטגוריות
    categories.forEach((category) => {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category");

        categoryElement.innerHTML = `
      <div class="category-circle" data-category-id="${category.id}">
        <img src="${category.image_url}" alt="${category.name}" />
      </div>
      <div class="category-name">${category.name}</div>
    `;

        // מאזין לאירועים בלחיצה על קטגוריה
        categoryElement.querySelector(".category-circle").addEventListener("click", () => {
            selectedCategory = category.id;
            loadProducts(selectedCategory); // טוען מוצרים לפי הקטגוריה שנבחרה
        });

        categoriesContainer.appendChild(categoryElement);
    });
}


async function loadProducts(categoryId = null) {
    const products = await fetchData("/api/products");

    // עדכון הכיתוב עם מספר המוצרים
    const productCountElement = document.getElementById("product-count");
    if (!productCountElement) {
        console.error("Error: #product-count not found in the DOM!");
        return;
    }

    // אם יש ID של קטגוריה, נציג רק את המוצרים שקשורים לאותה קטגוריה
    const filteredProducts = categoryId ?
        products.filter((product) => product.category_id === categoryId) :
        products; // אם אין קטגוריה נציג את כל המוצרים

    // עדכון כמות המוצרים
    productCountElement.textContent = `Loading ${filteredProducts.length} products`;

    updateProductList(filteredProducts);
}


function updateProductList(products) {
    const productsContainer = document.querySelector(".products-container");

    if (!productsContainer) {
        console.error("Error: .products-container not found in the DOM!");
        return;
    }
    productsContainer.innerHTML = "";

    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");

        // מוסיפים את התאריך הוספה של המוצר בתור תכונה שלא תוצג באתר כדי לנהל את השמת והסרת התווית ״חדש״
        productElement.setAttribute("data-date-added", product.created_at);

        let stars = "";
        for (let i = 0; i < product.rating; i++) {
            stars += `<span class="material-symbols-outlined">star</span>`; // כוכב זהב
        }

        productElement.innerHTML = `
    <a href="/products/${product.id}" class="product-name">${product.name}</a>
    ${
      isNewProduct(product.created_at)
        ? '<span class="material-symbols-outlined new-icon" style="font-size: 30px; margin-left: 20px;">fiber_new</span>'
        : ""
    }
    <a href="/category/${
      product.category_id
    }" class="product-category"> <span style="font-weight: bold;">Category:</span> ${getCategoryNameById(
    product.category_id
  )}</a>
    <img src="${product.image_url}" alt="${
    product.name
  } "class="product-image" />
    <div class="product-rating">${stars}</div>
    <div class="product-description"> <span style="font-weight: bold;">Description:</span> ${
      product.description
    }</div>
  `;

        productsContainer.appendChild(productElement);
    });
}

// ודא שהקוד רץ רק אחרי שכל ה-DOM נטען
document.addEventListener("DOMContentLoaded", () => {
    const categoriesContainer = document.querySelector(".categories-container");
    const productsContainer = document.querySelector(".products-container");

    // בדיקות אם האלמנטים קיימים
    if (!categoriesContainer) {
        console.error("Error: .categories-container not found in the DOM!");
        return;
    }
    if (!productsContainer) {
        console.error("Error: .products-container not found in the DOM!");
        return;
    }

    // פונקציה שתפתח את ההודעה
    function showMessage() {
        // יצירת אלמנט חדש להודעה
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        messageContainer.innerText = "Still working on it\nsee you soon :)";

        // הוספת ההודעה לדף
        document.body.appendChild(messageContainer);

        // הצגת ההודעה
        messageContainer.style.display = "block";

        // מחיקת ההודעה אחרי 3 שניות
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, 3000);
    }

    // הוספת מאזיני אירועים לאייקונים
    const favoriteIcon = document.querySelector(".favorite-icon");
    const shoppingCartIcon = document.querySelector(".material-symbols-outlined.shopping_cart-icon");
    const acuteIcon = document.querySelector(".acute-icon");
    const manageSearchIcon = document.querySelector(".manage-search-icon");

    // בדוק אם האייקונים קיימים לפני שמוסיף את מאזיני האירועים
    if (favoriteIcon) {
        favoriteIcon.addEventListener("click", showMessage);
    }

    if (shoppingCartIcon) {
        shoppingCartIcon.addEventListener("click", showMessage);
    }
    if (acuteIcon) {
        acuteIcon.addEventListener("click", showMessage);
    }

    if (manageSearchIcon) {
        manageSearchIcon.addEventListener("click", showMessage);
    }

    // טוען את הקטגוריות והמוצרים
    loadCategories();
    loadProducts(); // טוען את כל המוצרים בהתחלה
});

// פונקציה להוצאת שם הקטגוריה לפי המספר מזהה שיש במוצר
function getCategoryNameById(categoryId) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
}

// פונקציה לבדיקה האם המוצר חדש - זאת אומרת התווסף לפני פחות משלושה חודשים
function isNewProduct(productDate) {
    const currentDate = new Date();
    const productAddedDate = new Date(productDate);

    // חישוב ההבדל בחודשים
    const diffInMonths =
        (currentDate.getFullYear() - productAddedDate.getFullYear()) * 12 +
        currentDate.getMonth() -
        productAddedDate.getMonth();

    return diffInMonths < 3; // פחות מ-3 חודשים
}

// פונקציה לבדוק אם המוצר הוא רב מכר
function isBestSeller(numberOfPurchases) {
    return numberOfPurchases > 50;
}

// פונקציה שתתבצע בכל פעם שהדף נטען ותבדוק את המוצרים ש׳יימים באתר, תוריד או תוסיף להם את התווית ״חדש״
window.addEventListener("DOMContentLoaded", function() {
    // פקודה שמחזירה את כל האלמנטים שיש להם את המחלקה - פרודקט
    const products = document.querySelectorAll(".product");

    products.forEach((product) => {
        const dateAdded = product.getAttribute("data-date-added"); // נניח שיש לכל מוצר את התאריך ב-data-attribute
        const newTag = product.querySelector(".new-icon"); // התווית החדשה
        const numberOfPurchases = parseInt(product.getAttribute("data-purchases"));

        // אם לא חדש, הסתיר את התווית
        if (!isNewProduct(dateAdded)) {
            newTag.style.display = "none"; // נסתר אחרי 3 חודשים
        } else {
            newTag.style.display = "inline-block"; // הצג אם המוצר חדש
        }

        if (isBestSeller(numberOfPurchases)) {
            const bestSellerLabel = document.createElement("span");
            bestSellerLabel.classList.add("best-seller-label");
            bestSellerLabel.textContent = "Best Seller";
            product.appendChild(bestSellerLabel); // הוסף את התווית למוצר
        }
    });
});