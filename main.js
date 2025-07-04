const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');

const ratings = {}
starLocs = {
    'one-half': 6,
    'one': 15,
    'two-half': 28,
    'two': 37,
    'three-half': 46,
    'three': 55,
    'four-half': 65,
    'four': 76,
    'five-half': 89,
    'five': 200
}

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
            console.log(elLabel, eloc, elem);

            for (star in starLocs) {
                if (eloc < starLocs[star]) {
                    console.log(star);
                    break;
                }
            }
        })
    });
})

