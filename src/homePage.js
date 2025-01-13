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
async function loadCategories() {
  categories = await fetchData("/api/categories");
  updateCategoriesList(categories);
}

function updateCategoriesList(categories) {
  const categoriesContainer = document.querySelector(".categories-container");

  categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category");

    categoryElement.innerHTML = `
      <div class="category-circle">
        <img src="${category.image_url}" alt="${category.name}" />
      </div>
      <div class="category-name">${category.name}</div>
    `;

    categoriesContainer.appendChild(categoryElement);
  });
}

async function loadProducts() {
  const products = await fetchData("/api/products");
  productsList = products;
  updateProductList(products);
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

    //מוסיפים את התאריך הוספה של המוצר בתור תכונה שלא תוצג באתר כדי לנהל את השמת והסרת התווית ״חדש״
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

  // טוען את הקטגוריות והמוצרים
  loadCategories();
  loadProducts();
});

//פונקציה להוצאת שם הקטגוריה לפי המספר מזהה שיש במוצר
function getCategoryNameById(categoryId) {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Unknown Category";
}

// function formatCategoryName(categoryName) {
//   return categoryName.split(" ").join("_");
// }

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

//פונקציה שתתבצע בכל פעם שהדף נטען ותבדוק את המוצרים ש׳יימים באתר, תוריד או תוסיף להם את התווית ״חדש״
window.addEventListener("DOMContentLoaded", function () {
  // פקודה שמחזירה את כל האלמנטים שיש להם את המחלקה - פרודקט
  const products = document.querySelectorAll(".product");

  products.forEach((product) => {
    const dateAdded = product.getAttribute("data-date-added"); // נניח שיש לכל מוצר את התאריך ב-data-attribute
    const newTag = product.querySelector(".new-icon"); // התווית החדשה

    // אם לא חדש, הסתיר את התווית
    if (!isNewProduct(dateAdded)) {
      newTag.style.display = "none"; // נסתר אחרי 3 חודשים
    } else {
      newTag.style.display = "inline-block"; // הצג אם המוצר חדש
    }
  });
});
