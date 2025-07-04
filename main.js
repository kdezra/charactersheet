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
    });

    document.querySelectorAll(".rating").forEach(el => {
        el.addEventListener("mouseover", (e) => {
            const bounds = e.target.getBoundingClientRect();
            const eloc = e.x - bounds.x;
            console.log(eloc);
        });
    });
})

