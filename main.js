const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');

document.addEventListener("DOMContentLoaded", (event) => {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            // images[0].setAttribute('src', fileReader.result);
            image.setAttribute('style', `background-image: url('${fileReader.result}')`);
        }
    })
})

// $(".sheet-cont h2").on("click", function () {
//     $(this).next().toggleClass("hidden");
// });

// $(".sheet-buttons b.expand").on("click", function () {
//     $(".sheet-main").removeClass("hidden");
// });

// $(".sheet-buttons b.collapse").on("click", function () {
//     $(".sheet-main").addClass("hidden");
// });