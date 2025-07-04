const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');

const ratings = {}

document.addEventListener("DOMContentLoaded", (event) => {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            image.setAttribute('style', `background-image: url('${fileReader.result}')`);
        }
    });


    document.querySelectorAll(".rating").forEach((el) => {
        const elLabel = el.lastElementChild.textContent;
        ratings[`${elLabel}-rating`] = {
            'element':el,
            'stars': 0,
            'loc': 0
        };
        el.addEventListener("mousemove", (e) => {
            const bounds = e.target.getBoundingClientRect();
            ratings.loc = e.x - bounds.x;
        });
        el.addEventListener("click", (e) => {
            const elLabel = el.lastElementChild.textContent;
            const elem = ratings[`${elLabel}-rating`]
            const eloc = ratings.loc
            if (eloc < 6) {
                console.log(".5 star")
            } else if (eloc < 15) {
                console.log("1 star")
            } else if (eloc < 28) {
                console.log("1.5 star")
            } else if (eloc < 37) {
                console.log("2 star")
            } else if (eloc < 46) {
                console.log("2.5 star")
            } else if (eloc < 55) {
                console.log("3 star")
            } else if (eloc < 65) {
                console.log("3.5 star")
            } else if (eloc < 76) {
                console.log("4 star")
            } else if (eloc < 89) {
                console.log("4.5 star")
            } else {
                console.log("5 star")
            }
        })
    });
})

