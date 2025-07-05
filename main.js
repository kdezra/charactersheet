const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');

ratings = {}
starLocs = {
    'one-half': 13,
    'one': 20,
    'two-half': 33,
    'two': 40,
    'three-half': 53,
    'three': 60,
    'four-half': 73,
    'four': 80,
    'five-half': 93,
    'five': 110
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
        ratings[el.id] = {
            'element':el,
            'bounds': el.getBoundingClientRect(),
            'stars': 0,
            'loc': 0
        }
        el.addEventListener("mousemove", (e) => {
            const elId = e.target.id||e.target.parentElement.id
            const elem = ratings[elId]
            elem.loc = e.x - elem.bounds.x;
        });
        el.addEventListener("click", (e) => {
            const elId = e.target.id||e.target.parentElement.id
            const elem = ratings[elId]
            const eloc = elem.loc
            console.log(elId, eloc, elem);

            for (star in starLocs) {
                if (eloc < starLocs[star]) {
                    console.log(star);
                    elem.element.classList = `rating ${star}`
                    elem.stars = star
                    break;
                }
            }
        })
    });
})

