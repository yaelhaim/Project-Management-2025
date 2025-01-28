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

const productsData = {
    allProducts: [],
    filteredProducts: [],
    categoryFilter: false,
    nameFilter: false
}


async function loadProducts(categoryId = null) {
    const products = await fetchData("/api/products");
    productsData.allProducts = products;
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
    
    productsData.categoryFilter = categoryId != null;
    // עדכון כמות המוצרים
    productCountElement.textContent = `Loading ${filteredProducts.length} products`;
    productsData.filteredProducts = filteredProducts;
    updateProductList(filteredProducts);
}

// הוספת משתנה לשמירה על מצב התצוגה
let isGridView = true;

// פונקציה לעדכון תצוגת המוצרים
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



        // אם מצב התצוגה הוא "רשימה"
        if (!isGridView) {
            productElement.style.width = "90%";
            productElement.style.margin = "10px auto"; // מרכז את המוצר
            productElement.style.border = "2px solid #1d7fa5"; // גבול עבה בצבע 1d7fa5
            productElement.style.padding = "10px"; // רווח פנימי למוצר
            productElement.style.borderRadius = "5px"; // פינות מעוגלות
            productElement.style.height = "auto"; // הגדרה שהגובה ייקבע אוטומטית לפי התוכן


            // מוסיפים את התאריך הוספה של המוצר בתור תכונה שלא תוצג באתר כדי לנהל את השמת והסרת התווית ״חדש״
            productElement.setAttribute("data-date-added", product.created_at);

            let stars = "";
            for (let i = 0; i < product.rating; i++) {
                stars += `<span class="material-symbols-outlined">star</span>`; // כוכב זהב
            }



            productElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1; display: flex; align-items: center;">
                        <a href="productPage.HTML?productId=${product.id}" class="product-name" style="font-weight: bold;">${product.name}</a>
                        ${
                            isNewProduct(product.created_at)
                                ? '<span class="material-symbols-outlined new-icon" style="font-size: 30px; margin-left: 5px;">fiber_new</span>'
                                : ""
                        }
                    </div>
                    <div class="product-rating" style="margin-left: 10px;">${stars}</div>
               </div>
        <a href="#" class="product-category" data-category-id="${product.category_id}" style="font-weight: bold; display: block; margin-top: 5px;">Category: ${getCategoryNameById(product.category_id)}</a>
       <div style="display: flex; align-items: flex-start; margin-top: 10px;">
            <div style="flex: 1; margin-right: 10px;margin-top: 60px;"> <!-- הסבר -->
                <div class="product-description" style="max-width: 80%; overflow-wrap: break-word;"> 
                    <span style="font-weight: bold;">Description:</span> ${product.description}
                </div>
            </div>
            <div style="flex: 0 0 auto;"> <!-- תמונה -->
                <img src="${product.image_url}" alt="${product.name}" class="product-image" style="
                    max-width: 220px; /* גודל התמונה */
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin-left: 10px; /* רווח בין ההסבר לתמונה */
                    margin-right: 50px;
                "/>
            </div>
        </div>
    </div>
            `;

            productElement.querySelector(".product-category").addEventListener("click", (event) => {
                event.preventDefault(); // מניעת מעבר לדף חדש
                const categoryId = product.category_id;
                selectedCategory = categoryId; // עדכון הקטגוריה הנבחרת
                loadProducts(categoryId); // קריאה לפונקציה שמציגה מוצרים לפי הקטגוריה
            });




        } else {
            // const productsContainer = document.querySelector(".products-container");

            // if (!productsContainer) {
            //     console.error("Error: .products-container not found in the DOM!");
            //     return;
            // }
            // productsContainer.innerHTML = "";

            // products.forEach((product) => {
            // const productElement = document.createElement("div");
            // productElement.classList.add("product");

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
            // });
        }

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

// module for sort
const sortElements = (function() {
    const btnPopularity = document.getElementById("btnPopularity");
    const btnRecency = document.getElementById("btnRecency");
    const presentSort = document.getElementById("presentSort");

    const sortByPopularity = () => {
        productsData.filteredProducts.sort((p1, p2) => p2.number_of_purchase - p1.number_of_purchases); //rating
        updateProductList(productsData.filteredProducts);
        presentSort.classList.add('presentSort_hidden')
    }
    const sortByRecency = () => {
        productsData.filteredProducts.sort((p1, p2) => p2.created_at.localeCompare(p1.created_at));
        updateProductList(productsData.filteredProducts);
        presentSort.classList.add('presentSort_hidden')
    }
    return {
        btnPopularity,
        btnRecency,
        presentSort,
        sortByPopularity,
        sortByRecency,
    }
})();

// js module for accessing the filter elements
const filterElements = (function() {
    const from = document.getElementById("from");
    const to = document.getElementById("to");
    const fromMessage = document.getElementById("fromMessage");
    const toMessage = document.getElementById("toMessage");
    const btnApply = document.getElementById("btnApply");
    const starsFilter = document.querySelectorAll("#presentFilter>div>span")

    return { from, to, fromMessage, toMessage, btnApply, starsFilter }
})()

// js module for validating filter input changes
const filterHandlers = (function() {

    const validateCharacters = (input, p) => {
        input.setAttribute("maxlength", "10"); // Ensure the input has a maxlength
        const value = input.value.trim(); // get the value without space in the start and end
        try {
            const num = parseInt(value); // try to convert to integer
            if (isNaN(value) || num < 0 || value.length > 10 || input.value.includes(".")) { // validate value is positive and up to 10 characters
                throw new Exception()
            }
            p.innerHTML = "&nbsp;";
            input.style.borderColor = 'initial';
            input.style.outlineColor = 'initial';
            filterElements.btnApply.disabled = false;
            return num;
        } catch (err) { // on failure present an error meesgase
            p.innerText = "Enter valid values";
            input.style.borderColor = 'red';
            input.style.outlineColor = 'red';
            filterElements.btnApply.disabled = true;
            return -1;
        }
    }
    const validateFrom = () => {
        return validateCharacters(filterElements.from, filterElements.fromMessage);
    }
    const validateTo = () => {
        const toNum = validateCharacters(filterElements.to, filterElements.toMessage);
        const fromNum = validateCharacters(filterElements.from, filterElements.fromMessage);
        if (toNum > -1 && fromNum > -1) {
            if (toNum < fromNum) {
                filterElements.toMessage.innerText = "Enter valid values";
                filterElements.to.style.borderColor = 'red';
                filterElements.to.style.outlineColor = 'red';
                filterElements.btnApply.disabled = true;
            } else {
                filterElements.toMessage.innerHTML = "&nbsp;";
                filterElements.to.style.borderColor = 'initial';
                filterElements.to.style.outlineColor = 'initial';
                filterElements.btnApply.disabled = false;
                return toNum;
            }
        }
        return -1;
    }
    const countStars = () => {
        let count = 0;
        for (star of filterElements.starsFilter) {
            if (star.getAttribute("data-select") == "true") {
                count++;
            }
        }
        return count;
    }
    const FilterByPriceAndRating = async() => {
        const from = validateFrom();
        const to = validateTo();
        const stars = countStars();

        let lastFilter;
        if(productsData.categoryFilter || productsData.nameFilter){
            lastFilter = productsData.filteredProducts;
        }else{
            lastFilter = productsData.allProducts;
        }
        // if (lastFilter.length == 0) {
        //     productsData.allProducts;
        // }
        lastFilter = lastFilter
            .filter(p => to > 0 ? p.price >= from && p.price <= to : true)
            .filter(p => p.rating >= stars);
        updateProductList(lastFilter);
        const productCountElement = document.getElementById("product-count");
        productCountElement.textContent = `Loading ${lastFilter.length} products`;
    }
    return {
        validateFrom,
        validateTo,
        FilterByPriceAndRating
    }
})()

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
    console.log(favoriteIcon);

    favoriteIcon.addEventListener("click", () => {
        window.location.href = "favorite_productsPage.html";
    });
    const shoppingCartIcon = document.querySelector(".material-symbols-outlined.shopping_cart-icon");
    console.log(shoppingCartIcon);

    shoppingCartIcon.addEventListener("click", () => {
        // מעבירים את המשתמש לעמוד היעד
        window.location.href = "shoppingCartPage.html";
    });

    const acuteIcon = document.querySelector(".acute-icon");
    console.log(acuteIcon);

    acuteIcon.addEventListener("click", () => {
        window.location.href = "productHistoryPage.html";
    });
    const manageSearchIcon = document.querySelector(".manage-search-icon");
    console.log(manageSearchIcon);

    manageSearchIcon.addEventListener("click", () => {
        window.location.href = "searchHistoryPage.html";
    });

    const listIcon = document.querySelector(".format-list-icon");
    const gridIcon = document.querySelector(".grid-icon");
    console.log(listIcon);
    listIcon.addEventListener("click", () => {
        isGridView = false; // שים את מצב התצוגה לרשימה

        listIcon.style.display = "none"; // הסתר את אייקון הרשימה
        gridIcon.style.display = "inline"; // הצג את אייקון הגריד
        updateProductList(productsData.filteredProducts); // עדכן את התצוגה

    });

    console.log(gridIcon);
    gridIcon.addEventListener("click", () => {
        isGridView = true; // שים את מצב התצוגה לגריד
        gridIcon.style.display = "none"; // הסתר את אייקון הגריד
        listIcon.style.display = "inline"; // הצג את אייקון הרשימה
        updateProductList(productsData.filteredProducts); // עדכן את התצוגה
    });

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");



    // פונקציה שתבצע חיפוש במוצרים
    function searchProducts(query) {
        fetchData("/api/products").then((products) => {
            const filteredProducts = products.filter((product) =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            productsData.filteredProducts = filteredProducts;
            productsData.nameFilter = true;
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
        sortElements.presentSort.classList.add('presentSort_hidden');
    })
    document.getElementById("sortProducts").addEventListener('click', (event) => {
        sortElements.presentSort.classList.remove('presentSort_hidden');
        event.stopImmediatePropagation();
        presentFilter.classList.add('presentFilter_hidden');
    })
    document.body.addEventListener('click', () => {
        presentFilter.classList.add('presentFilter_hidden');
        sortElements.presentSort.classList.add('presentSort_hidden');
    })
    document.addEventListener('scroll', () => {
        presentFilter.classList.add('presentFilter_hidden');
        sortElements.presentSort.classList.add('presentSort_hidden');
    })

    filterElements.from.addEventListener('input', filterHandlers.validateFrom);
    filterElements.to.addEventListener('input', filterHandlers.validateTo);
    filterElements.btnApply.addEventListener('click', filterHandlers.FilterByPriceAndRating);

    sortElements.btnPopularity.addEventListener('click', sortElements.sortByPopularity);
    sortElements.btnRecency.addEventListener('click', sortElements.sortByRecency);
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


// this function to handle searching for products
async function searchProducts(query) {
    const products = await fetchData("/api/products");
    const results = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    productsData.nameFilter = true;
    const searchResultsContainer = document.getElementById("search-results");
    //searchResultsContainer.innerHTML = ""; // Clear previous results

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

// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Check if 'search' parameter exists in the URL
document.addEventListener("DOMContentLoaded", () => {
    const searchQuery = getQueryParam("search");
    if (searchQuery) {
        // Trigger the search with the query from the URL
        document.querySelector(".search-input").value = searchQuery; // Set the search input value
        searchProducts(searchQuery); // Call the search function
    }
});