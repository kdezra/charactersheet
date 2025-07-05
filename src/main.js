const inputData = {}
const storage = {'img':{}, 'radio':{}, 'slider':{}, 'text':{}, 'check':{}}

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

function setStorage() {
    for (key in inputData) {
        storage[inputData[key].type][key] = inputData[key].data
    }
    console.log(storage)
}
function readStorage() {
    for (elType in storage) {
        let typeIds = storage[elType]
        for (key in typeIds) {
            inputData[key] = {'type': elType, 'data': typeIds[key]}
        }
    }
    console.log(inputData)
}

function resetAll() {
    resetKey = {'img':'', 'slide':'0%', 'check': 0, 'radio': 'zero', 'text': ''}
    for (key in inputData) {
        let elType = inputData[key].type;
        let resetVal = resetKey[elType]
        const el = document.getElementById(key)
        switch (elType) {
            case "text":
                el.value = resetVal
                break;
            case "radio":
                el.classList = `rating ${resetVal}`
                break;
            case "slide":
                const sliderline = el.children[1]
                const slidermark = sliderline.children[0]
                slidermark.style.width = resetVal
                break;
            case "check":
                el.classList = `box ${resetVal}`.trim()
                break;
            case "img":
                image.setAttribute('style', resetVal);
                break;
            default:  break;
        }
    }
    setStorage()
}

document.addEventListener("DOMContentLoaded", (event) => {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            image.setAttribute('style', `background-image: url('${fileReader.result}')`);
            inputData.portrait = {'type':'img' ,'data': fileReader.result};
        }
    });

    clearBtn.addEventListener('click', (e) => {
        inputData.portrait.data = ''
        image.setAttribute('style', '');
        setStorage()
    });

    printBtn.addEventListener('click', print)
    resetBtn.addEventListener('click', resetAll)

    // Text Fill
    document.querySelectorAll(".text-fill").forEach((el) => {
        if (el.id in inputData) {
            el.value = inputData[el.id].data
        } else {
            inputData[el.id] = {'type':'text', 'data': ''}
        }
        el.addEventListener("change", (e) => {
            const elId = e.target.id
            inputData[elId].data = e.target.value
            setStorage()
        })
    });


    // Radio Selections
    document.querySelectorAll(".rating").forEach((el) => {
        if (el.id in inputData) {
            el.classList = `rating ${inputData[el.id].data}`
        } else {
            inputData[el.id] = {'type':'radio', 'data':'zero'}
        }
        inputData[el.id].element = el
        inputData[el.id].bounds = el.getBoundingClientRect()
        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "rating").id
            const elem = inputData[elId]
            const loc = e.x - elem.bounds.x;
            if (e.shiftKey) {
                elem.element.classList = 'rating zero'
                elem.data = 'zero'
            } else{
                for (n in nLocs) {
                    if (loc < nLocs[n]) {
                        elem.element.classList = `rating ${n}`
                        elem.data = n
                        break;
                    }
                }
            }
            setStorage()
        })
    });

    // Sliders
    document.querySelectorAll(".slider").forEach((el) => {
        const sliderline = el.children[1]
        const slidermark = sliderline.children[0]
        if (el.id in inputData) {
            slidermark.style.width = inputData[el.id].data
        } else {
            inputData[el.id] = {'type': 'slide','data': '0%'}
        }
        inputData[el.id].mark = slidermark
        inputData[el.id].bounds = sliderline.getBoundingClientRect()

        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "slider").id
            const elem = inputData[elId]
            const loc = e.x - elem.bounds.x;
            const perc = 100*Math.max(0, Math.min(1, loc / elem.bounds.width));
            elem.data = `${Math.round(elem.perc)}%`;
            elem.mark.style.width = elem.data;
            setStorage()
        });
    })

    document.querySelectorAll(".box").forEach((el) => {
        if (el.id in inputData) {
            const chk = ['', 'checked', 'checkedish', 'checkedidk']
            const i = inputData[el.id].data
            el.classList = `box ${chk[i]}`.trim()
        } else {
            inputData[el.id] = {'type': 'check', 'data': 0}
        }
        inputData[el.id].element = el
        el.addEventListener("click", (e) => {
            const chk = ['', 'checked', 'checkedish', 'checkedidk']
            const elId = e.target.id
            const elem = inputData[elId]
            let i = 0
            if !(e.ctrlKey && e.shiftKey)||!elem.data{
                i = e.shiftKey?2:(e.ctrlKey?3:1)
            }
            elem.element.classList = `box ${chk[i]}`.trim()
            elem.data = i
            setStorage()
        });
    })

    window.addEventListener("resize", (e) => {
        document.querySelectorAll(".slider").forEach((el) => {
            const sliderline = el.children[1]
            inputData[el.id].bounds = sliderline.getBoundingClientRect()
        })
        document.querySelectorAll(".rating").forEach((el) => {
            inputData[el.id].bounds = el.getBoundingClientRect()
        })
    });
})

