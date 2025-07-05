const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');
let imageData = null;

inputData = {}
const nLocs = {
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

function findParent(e, c, attr = "class") {
    if ((e.getAttribute(attr)||" ").split(" ").includes(c)) return e;
    let el = e;
    while( el.parentElement != null){
        el = el.parentElement;
        if ((el.getAttribute(attr)||" ").split(" ").includes(c)) return el;
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
            'n': 0,
            'loc': 0
        }
        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "rating").id
            const elem = inputData[elId]
            const eloc = e.x - elem.bounds.x;
            console.log(elId, eloc, elem);

            for (n in nLocs) {
                if (eloc < nLocs[n]) {
                    console.log(n);
                    elem.element.classList = `rating ${n}`
                    elem.n = n
                    break;
                }
            }
        })
    });

    // Sliders
    document.querySelectorAll(".slider").forEach((el) => {
        const sliderline = el.children[1]
        const slidermark = sliderline.children[0]
        inputData[el.id] = {
            'type': 'slide',
            'element':el,
            'mark':slidermark,
            'bounds': sliderline.getBoundingClientRect(),
            'perc': 0,
            'loc': 0
        }
        
        el.addEventListener("click", (e) => {
            console.log(e)
            const elId = findParent(e.target, "slider").id
            const elem = inputData[elId]
            elem.loc = e.x - elem.bounds.x;
            elem.perc = Math.max(0,Math.min((elem.loc / elem.bounds.width),1));
            elem.mark.style.width = `${Math.round(100*elem.perc)}%`;
            console.log(elem.perc)
        });
    })


    document.querySelectorAll(".box").forEach((el) => {
        inputData[el.id] = {
            'type': 'check',
            'element':el,
            'checked': false,
            'checkedish': false,
            'checkedidk': false
        }
        el.addEventListener("click", (e) => {
            const elId = e.target.id
            const elem = inputData[elId]
            if (e.ctrlKey && e.shiftKey) {
                elem.checked = false
                elem.checkedish = false
                elem.checkedidk = false
                elem.element.classList = 'box';
            } else if (e.shiftKey) {
                elem.checkedish = !elem.checkedish
                elem.checked = false
                elem.checkedidk = false
                elem.element.classList = elem.checkedish?'box checkedish':'box';
            } else if (e.ctrlKey) {
                elem.checked = false
                elem.checkedish = false
                elem.checkedidk = !elem.checkedidk
                elem.element.classList = elem.checkedidk?'box checkedidk':'box';
            } else {
                elem.checked = !elem.checked
                elem.checkedish = false
                elem.checkedidk = false
                elem.element.classList = elem.checked?'box checked':'box';
            }
        });
    })
})

