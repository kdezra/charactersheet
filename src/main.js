const inputData = {'imageData':null}
const storage = {}

const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');
const clearBtn = document.getElementById('portrait-clear');
const resetBtn = document.getElementById('reset');
const printBtn = document.getElementById('portrait');
const nLocs = {
    'zero': 5,
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
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            image.setAttribute('style', `background-image: url('${fileReader.result}')`);
            inputData.imageData = fileReader.result;
        }
    });

    clearBtn.addEventListener('click', (e) => {
        inputData.imageData = null
        image.setAttribute('style', '');
    });

    // Text Fill
    document.querySelectorAll(".text-fill").forEach((el) => {
        inputData[el.id] = {
            'type':'text',
            'element':el,
            'val': 0
        }
        el.addEventListener("change", (e) => {
            console.log("TEXT CHANGED", e)
        })
    });


    // Radio Selections
    document.querySelectorAll(".rating").forEach((el) => {
        inputData[el.id] = {
            'type':'radio',
            'element':el,
            'bounds': el.getBoundingClientRect(),
            'n': 'zero'
        }
        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "rating").id
            const elem = inputData[elId]
            const loc = e.x - elem.bounds.x;
            if (e.shiftKey) {
                elem.element.classList = 'rating zero'
                elem.n = 'zero'
            } else{
                for (n in nLocs) {
                    if (loc < nLocs[n]) {
                        console.log(n);
                        elem.element.classList = `rating ${n}`
                        elem.n = n
                        break;
                    }
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
            'perc': 0
        }
        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "slider").id
            const elem = inputData[elId]
            const loc = e.x - elem.bounds.x;
            const perc = loc / elem.bounds.width
            console.log(e, elem, perc, loc)
            elem.perc = 100*Math.max(0, Math.min(1, perc));
            elem.mark.style.width = `${Math.round(elem.perc)}%`;
            console.log(elem.perc)
        });
    })


    window.addEventListener("resize", (e) => {
        document.querySelectorAll(".slider").forEach((el) => {
            const sliderline = el.children[1]
            inputData[el.id].bounds = sliderline.getBoundingClientRect()
        }
    });


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

