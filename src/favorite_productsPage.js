document.addEventListener("DOMContentLoaded", () => {
    // פונקציה להציג הודעה על המסך
    const showNotification = (message) => {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.style.display = "block";

        // הסתרת ההודעה אחרי 3 שניות
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    };

    // לכל כפתור "הוסף לסל"
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation(); // מונע מהאירוע לעלות למעלה
            showNotification("Product added to cart");
        });
    });

    // לכל כפתור "הסר"
    const removeButtons = document.querySelectorAll(".remove");
    removeButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation(); // מונע מהאירוע לעלות למעלה
            // איתור המוצר שצריך להסיר
            const productElement = event.target.closest(".product");
            if (productElement) {
                productElement.remove(); // הסרת המוצר מהדף
                showNotification("Product removed from cart");
            }
        });
    });

    // הוספת אירועי לחיצה למוצרים
    const products = document.querySelectorAll(".product");
    products.forEach((product) => {
        product.addEventListener("click", () => {
            window.location.href = "productPage.html"; // מבלי לבדוק אם הדף קיים
        });
    });
});