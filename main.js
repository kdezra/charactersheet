const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');

ratings = {}
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
        ratings[el.id] = {
            'element':el,
            'bounds': el.getBoundingClientRect(),
            'stars': 0,
            'loc': 0
        }
        el.addEventListener("mousemove", (e) => {
            const elId = e.target.id||e.target.parentElement.id
            ratings[elId].loc = e.x - ratings[elId].x;
        });
        el.addEventListener("click", (e) => {
            const elId = e.target.id||e.target.parentElement.id
            const elem = ratings[elId]
            const eloc = elem.loc
            console.log(elId, eloc, elem);

            for (star in starLocs) {
                if (eloc < starLocs[star]) {
                    console.log(star);
                    elem.element.classList = ['rating', 'star']
                    break;
                }
            }
        })
    });
})

