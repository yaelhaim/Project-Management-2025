
// מניחים שמידע המוצר כבר טוען והשתמשנו ב-openPDF עם כתובת ה-PDF
function openPDF(product_pdf_url) {
    const pdfOverlay = document.getElementById("pdf-overlay");
    // const pdfEmbed = document.getElementById("pdf-embed");
    const canvas = document.getElementById("pdf-canvas");

    // לבדוק אם לבטל
    //pdfEmbed.src = product_pdf_url; // עדכון ה-src של ה-embed עם ה-URL של ה-PDF
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


// ***** fetch products and display them ***** //

async function fetchProduct(productId){
    try{
     // קריאה ל-API לקבלת פרטי המוצר לפי מזהה
     const response = await fetch(`/products/${productId}`);
     if (!response.ok) throw new Error("Failed to fetch product details");

     const product = await response.json();
     return product
    }catch(err){
        console.log();
        return null;
    }

}

async function showComparison() {
    let compareList = []
    const strCompareList = sessionStorage.getItem("compareList");
    if (strCompareList) {
        compareList = JSON.parse(strCompareList);
    }else{
        const container = document.querySelector(".table-container");
        container.innerHTML = `<h2 class="no-products">There are no Products to compare</h2>`;
        return;
    }
    
    const product1 = await fetchProduct(compareList[0])
    const product2 = await fetchProduct(compareList[1])

    const product1_title = document.getElementById("product1_title");
    const product2_title = document.getElementById("product2_title");
    const productProperties = document.getElementById("productProperties");

    product1_title.innerHTML = "";
    product2_title.innerHTML = "";
    productProperties.innerHTML = "";
    
    product1_title.innerHTML = `<img src="${product1.image_url}" /><p><strong>${product1.name}</strong></p> `;
    product2_title.innerHTML = `<img src="${product2.image_url}" /><p><strong>${product2.name}</strong></p> `;

    productProperties.innerHTML += `<tr><td>${product1.catalog_number}</td><td>${product2.catalog_number}</td><td>catalog number</td> </tr>`

    let stars1 = "";
    let stars2 = "";
    for(let i = 0; i < product1.rating; i++){
        stars1 += `<span class="material-symbols-outlined">star</span>` 
    }
    for(let i = 0; i < product2.rating; i++){
        stars2 += `<span class="material-symbols-outlined">star</span>` 
    }
    productProperties.innerHTML += `<tr><td>${stars1}</td><td>${stars2}</td><td>rating</td> </tr>`

    const info1 = `<a href="#" id="brochure-link1">Information Brochure</a>`
    const info2 = `<a href="#" id="brochure-link2">Information Brochure</a>`
    productProperties.innerHTML += `<tr><td>${info1}</td><td>${info2}</td><td>information</td> </tr>`
    
    document.getElementById("brochure-link1").addEventListener("click", function (event) {
        event.preventDefault(); // מונע את הפעולה המוגדרת ב-href (#)

        // כאן אתה שולף את הקישור ל-PDF ממקור כלשהו, לדוגמה:
        openPDF(product1.pdf_url); // קריאה לפונקציה עם ה-URL של ה-PDF
    });
    document.getElementById("brochure-link2").addEventListener("click", function (event) {
        event.preventDefault(); // מונע את הפעולה המוגדרת ב-href (#)
        
        // כאן אתה שולף את הקישור ל-PDF ממקור כלשהו, לדוגמה:
        openPDF(product2.pdf_url); // קריאה לפונקציה עם ה-URL של ה-PDF
    });
    productProperties.innerHTML += `<tr><td>${product1.price}</td><td>${product2.price}</td><td>price</td> </tr>`
    productProperties.innerHTML += `<tr><td>${product1.discount_price !== null ? product1.discount_price : "-"}</td><td>${product2.discount_price !== null ? product2.discount_price : "-"}</td><td>discount price</td> </tr>`
    productProperties.innerHTML += `<tr><td><button type="button" id="btn1">Buy now</button></td><td><button type="button" id="btn2">Buy now</button></td><td>purchase link</td> </tr>`

    document.getElementById("btn1").addEventListener("click", function (event){
        //product1
        alert('Service is not available')
    });
    document.getElementById("btn2").addEventListener("click", function (event){
        //product2
        alert('Service is not available')
    });
}

document.addEventListener("DOMContentLoaded", function(){
    document.querySelector(".empty-comparison").addEventListener('click', function(){
        sessionStorage.removeItem("compareList");
        const container = document.querySelector(".table-container");
        container.innerHTML = `<h2 class="no-products">There are no Products to compare</h2>`;
        setTimeout(() => {
            window.location.href = "homePage.html";
        }, 2000);

    })
    showComparison();
});