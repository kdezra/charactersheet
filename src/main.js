inputData = {'imageData':null}

const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');
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

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

function compressImage(dataURI) {
    console.log(dataURItoBlob(dataURI))
    const img = new Image()
    img.src = dataURI
    img.onload = function () {
        // const canvas = document.createElement('canvas')
        const canvas = document.getElementById('canvas')
        canvas.style.background = "#08080B";
        canvas.width  = 180; 
        canvas.height = 240; 
        const ratio = img.height / img.width
        let xOff = 0
        let yOff = 0
        if (ratio > 1){
            let h = Math.min(240, img.height)
            let w = img.width*h/img.height
            img.height = h
            img.width = w
        } else {
            let w = Math.min(180, img.width)
            let h = img.height*w/img.width
            img.height = h
            img.width = w
        }
        let ctx = canvas.getContext("2d")
        ctx.drawImage(img,xOff,yOff)
        const newURI = canvas.toDataURL("image/jpeg", "0.5")
        console.log(canvas)
        console.log(img)
        console.log(dataURItoBlob(newURI))
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    // Image Upload
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            image.setAttribute('style', `background-image: url('${fileReader.result}')`);
            inputData.imageData = fileReader.result;
            console.log(compressImage(inputData.imageData))
        }
    });

    document.addEventListener("resize", (e) => {
        console.log("RESIZED", e)
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
            'n': 0
        }
        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "rating").id
            const elem = inputData[elId]
            const loc = e.x - elem.bounds.x;
            console.log(elId, loc, elem);

            for (n in nLocs) {
                if (loc < nLocs[n]) {
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

