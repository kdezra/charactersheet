const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');
let imageData = null;

inputData = {}
const starLocs = {
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

function findParent(e, c, attr = "class") => {
    if ((e.getAttribute(attr)||" ").split(" ").includes(c)) {return e;}
    let el = e;
    while( el.parentElement != null){
        el = el.parentElement;
        if ((el.getAttribute(attr)||" ").split(" ").includes(c)) {return el;}
    }
    return;
}

document.addEventListener("DOMContentLoaded", (event) => {
    // Image Upload
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            image.setAttribute('style', `background-image: url('${fileReader.result}')`);
            imageData = fileReader.result;
        }
    });


    // Radio Selections
    document.querySelectorAll(".rating").forEach((el) => {
        inputData[el.id] = {
            'type':'radio',
            'element':el,
            'bounds': el.getBoundingClientRect(),
            'stars': 0,
            'loc': 0
        }
        el.addEventListener("mousemove", (e) => {
            const elId = findParent(e.target, "rating").id
            const elem = inputData[elId]
            elem.loc = e.x - elem.bounds.x;
        });
        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "rating").id
            const elem = inputData[elId]
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

    // Sliders
    document.querySelectorAll(".slider").forEach((el) => {
        inputData[el.id] = {
            'type': 'slide',
            'element':el,
            'bounds': el.getBoundingClientRect(),
            'perc': 0,
            'loc': 0
        }
        el.addEventListener("mousemove", (e) => {
            const elClass = findParent(e.target, "slider").id
            const elem = inputData[elId]
            elem.loc = e.x - elem.bounds.x;
        });
        el.addEventListener("click", (e) => {
            console.log(e)
        });
    })


    document.querySelectorAll(".box").forEach((el) => {
        inputData[el.id] = {
            'type': 'check',
            'element':el,
            'checked': false
        }
        el.addEventListener("click", (e) => {
            const elId = e.target.id
            const elem = inputData[elId]
            elem.checked = !elem.checked
            elem.element.classList = elem.checked?'box checked':'box';
        });
    })
})

