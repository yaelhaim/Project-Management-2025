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
        <a href="productPage.HTML?productId=${product.id}" class="product-name">${product.name}</a>
        ${
          isNewProduct(product.created_at)
            ? '<span class="material-symbols-outlined new-icon" style="font-size: 30px; margin-left: 20px;">fiber_new</span>'
            : ""
        }
        <a href="#" class="product-category" data-category-id="${product.category_id}"> 
            <span style="font-weight: bold;">Category:</span> ${getCategoryNameById(product.category_id)}
        </a>
        <img src="${product.image_url}" alt="${product.name}" class="product-image" />
        <div class="product-rating">${stars}</div>
        <div class="product-description"> 
            <span style="font-weight: bold;">Description:</span> ${product.description}
        </div>
    `;

        productElement.querySelector(".product-category").addEventListener("click", (event) => {
            event.preventDefault(); // מניעת מעבר לדף חדש
            const categoryId = product.category_id;
            selectedCategory = categoryId; // עדכון הקטגוריה הנבחרת
            loadProducts(categoryId); // קריאה לפונקציה שמציגה מוצרים לפי הקטגוריה
        });


        productsContainer.appendChild(productElement);
    });
}

function handleFilterStars(starOrder) {
    document.querySelectorAll("#presentFilter>div>span").forEach(s => {
        const order = parseInt(s.getAttribute('data-order'));

        if (order < starOrder) {
            s.setAttribute('data-select', 'true');
            s.style.color = 'gold';
        } else if (order > starOrder) {
            s.setAttribute('data-select', 'false');
            s.style.color = 'black'
        }
    })
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
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

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

    // פונקציה שתבצע חיפוש במוצרים
    function searchProducts(query) {
        fetchData("/api/products").then((products) => {
            const filteredProducts = products.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            updateProductList(filteredProducts);

            const productCountElement = document.getElementById("product-count");
            productCountElement.textContent = `Found ${filteredProducts.length} products for "${query}"`;
        });
    }

    // אירוע לחיצה על כפתור החיפוש
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            searchProducts(query);
        } else {
            loadProducts(); // טען מחדש את כל המוצרים אם אין טקסט בחיפוש
        }
    });

    // אפשרות להפעיל את החיפוש בלחיצה על Enter
    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.trim();
            if (query) {
                searchProducts(query);
            } else {
                loadProducts(); // טען מחדש את כל המוצרים אם אין טקסט בחיפוש
            }
        }
    });

    // טוען את הקטגוריות והמוצרים
    loadCategories();
    loadProducts(); // טוען את כל המוצרים בהתחלה

    // 
    const presentFilter = document.getElementById("presentFilter");
    presentFilter.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
    });
    const starsFilter = document.querySelectorAll("#presentFilter>div>span")
    for (const star of starsFilter) {
        star.setAttribute('data-select', 'false')
        star.style.color = 'black';
        star.addEventListener('click', (event) => {
            const selected = event.target.getAttribute('data-select');
            const starOrder = parseInt(event.target.getAttribute('data-order'));
            if (selected == 'false') {
                event.target.setAttribute('data-select', 'true');
                event.target.style.color = 'gold';
                handleFilterStars(starOrder);
            } else {
                event.target.setAttribute('data-select', 'false');
                event.target.style.color = 'black';
                handleFilterStars(starOrder);
            }
        })
    }
    document.getElementById("btnApply").addEventListener('click', () => {
        presentFilter.classList.add('presentFilter_hidden');
    })
    document.getElementById("filterByDiv").addEventListener('click', (event) => {
        document.getElementById("presentFilter").classList.remove('presentFilter_hidden');
        event.stopImmediatePropagation();
    })
    document.body.addEventListener('click', () => {
        presentFilter.classList.add('presentFilter_hidden');
    })
    document.addEventListener('scroll', () => {
        presentFilter.classList.add('presentFilter_hidden');
    })
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


// Add this function to handle searching for products
async function searchProducts(query) {
    const products = await fetchData("/api/products");
    const results = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));

    const searchResultsContainer = document.getElementById("search-results");
    searchResultsContainer.innerHTML = ""; // Clear previous results

    if (results.length > 0) {
        results.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <a href="productPage.HTML?productId=${product.id}" class="product-name">${product.name}</a>
                <img src="${product.image_url}" alt="${product.name}" class="product-image" />
            `;
            searchResultsContainer.appendChild(productElement);
        });
        searchResultsContainer.style.display = "block"; // Show results
    } else {
        searchResultsContainer.innerHTML = "<p>No products found.</p>"; // Show no results message
        searchResultsContainer.style.display = "block"; // Show message
    }
}

// Add an event listener for the search button
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.querySelector(".search-input").value.trim();
    if (query) {
        searchProducts(query);
    } else {
        const searchResultsContainer = document.getElementById("search-results");
        searchResultsContainer.innerHTML = "<p>Please enter a search term.</p>";
        searchResultsContainer.style.display = "block";
    }
});