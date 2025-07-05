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
        inputData[el.id] = {
            'type': 'slide',
            'element':el,
            'bounds': el.getBoundingClientRect(),
            'perc': 0,
            'loc': 0
        }
        
        el.addEventListener("click", (e) => {
            console.log(e)
            const elId = findParent(e.target, "slider").id
            const elem = inputData[elId]
            console.log(elem)
            elem.loc = e.x - elem.bounds.x;
            elem.perc = 100*(elem.loc / bounds.width);
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
            if (e.shiftKey) {
                elem.checkedish = !elem.checkedish
                elem.checked = false
                elem.checkedidk = false
                elem.element.classList = elem.checked?'box checkedish':'box';
            } else if (e.ctrlKey) {
                elem.checkedidk = !elem.checkedidk
                elem.checked = false
                elem.checkedish = false
                elem.checkedidk = !elem.checkedidk
                elem.element.classList = elem.checked?'box checkedidk':'box';
                
            } else {
                elem.checked = !elem.checked
                elem.checkedish = false
                elem.checkedidk = false
                elem.element.classList = elem.checked?'box checked':'box';
            }
        });
    })
})

