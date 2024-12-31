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
