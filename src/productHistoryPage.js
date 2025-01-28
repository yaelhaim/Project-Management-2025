
const customerProducts = {
    history: [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010],
    productsList: []
}
let categories = [];

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

async function loadCategories() {
    categories = await fetchData("/api/categories");

}

async function loadHistory() {
    document.getElementById("product-count").innerText = `Loading ${customerProducts.history.length} products`;

    for (const productId of customerProducts.history) {
        try {
            const product = await fetchData(`/products/${productId}`);
            customerProducts.productsList.push(product)
        } catch (err) {
            console.log(err);
        }

    }

    updateProductList(customerProducts.productsList)
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


// פונקציה להוצאת שם הקטגוריה לפי המספר מזהה שיש במוצר
function getCategoryNameById(categoryId) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
}

function updateProductList(products) {

    const productsContainer = document.querySelector(".products-container");

    if (!productsContainer) {
        console.error("Error: .products-container not found in the DOM!");
        return;
    }
    productsContainer.innerHTML = "";

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
        ${isNewProduct(product.created_at)
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

document.addEventListener("DOMContentLoaded", async function () {
    await loadCategories();
    await loadHistory();
});