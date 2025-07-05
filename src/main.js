const inputData = {}
const storage = {'radio':{}, 'slide':{}, 'text':{}, 'check':{}}
const savedData = {}
const keyMap = {}

let storageKeys = ["CHARTAB_store"]
let storageKey = "CHARTAB_store"
let imgStorage = null;

const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');
const clearBtn = document.getElementById('portrait-clear');
const resetBtn = document.getElementById('reset-btn');
const printBtn = document.getElementById('print-btn');
const saveBtn = document.getElementById('save-btn');
const select = document.getElementById('save-select');
const nLocs = { 'zero': 5, 'one-half': 13, 'one': 20, 'two-half': 33, 'two': 40,
                'three-half': 53, 'three': 60, 'four-half': 73, 'four': 80, 'five-half': 93, 'five': 110 }

function shortUUID() {
  return (Date.now().toString(36) + Math.random().toString(36).substring(2, 6));
}
function sanitizeName(name) {
  return name.replace(/[^a-z0-9]/gi, '');
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

function storeStorage(skey=null) {
    storeKey = skey||storageKey
    const storeString = JSON.stringify(storage)
    window.localStorage.setItem(`${storeKey}_img`, imgStorage)
    window.localStorage.setItem(storeKey, storeString)
}

function getStorage(skey=null) {
    storeKey = skey||storageKey
    const tempStorage = {'i':null,'s':{'radio':{}, 'slide':{}, 'text':{}, 'check':{}}}
    tempStorage.i = window.localStorage.getItem(`${storeKey}_img`)
    const storeString = window.localStorage.getItem(storeKey)
    const storeJSON = JSON.parse(storeString)
    for (key in storeJSON) {
        tempStorage.s[key] = storeJSON[key]
    }
    return tempStorage
}

function setStorage() {
    for (key in inputData) {
        storage[inputData[key].type][key] = inputData[key].data
    }
    storeStorage()
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

function resetAll() 
    const confirmSave = confirm("Do you want to save your work before resetting?");
    if (confirmSave) { saveBtn.click() }
    resetKey = {'slide':'0%', 'check': 0, 'radio': 'zero', 'text': ''}
    for (key in inputData) {
        let elType = inputData[key].type;
        let resetVal = resetKey[elType]

        storage[inputData[key].type][key] = resetVal
        inputData[key].data = resetVal

        const el = document.getElementById(key)
        switch (elType) {
            case "text":
                el.value = resetVal
                break;
            case "radio":
                el.classList = `rating ${resetVal}`
                break;
            case "slide":
                const slidermark = document.querySelector(`#${key} .slidermark`)
                slidermark.style.width = resetVal
                break;
            case "check":
                el.classList = `box ${resetVal}`.trim()
                break;
            default:  break;
        }
    }
    imgStorage = ''
    image.setAttribute('style', '');
    console.log(storage)
    console.log(inputData)
}

// Populate the save dropdown
function populateSaveDropdown() {
  select.innerHTML = ''; // Clear
  const defaultOpt = document.createElement('option');
  defaultOpt.textContent = 'Select Saved';
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  select.appendChild(defaultOpt);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('CHARTAB_store_n') && !key.endsWith('_img')) {
      if (!(key in savedData)) {
        savedData[key] = getStorage(key);
      }

      const name = savedData[key]?.s?.text?.['in-name'] || '(no name)';
      const option = document.createElement('option');
      option.value = key;
      option.textContent = name;
      select.appendChild(option);
    }
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
    const tempStorage = getStorage()
    storage = tempStorage.s
    imgStorage = tempStorage.i
    readStorage()

    console.log(imgStorage)
    if (imgStorage) {
        image.setAttribute('style', `background-image: url('${imgStorage}')`);
    }
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
            image.setAttribute('style', `background-image: url('${fileReader.result}')`);
            imgStorage = fileReader.result;
        }
    });
    

    clearBtn.addEventListener('click', (e) => {
        imgStorage = ''
        image.setAttribute('style', '')
    });

    // printBtn.addEventListener('click', print)
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
        const sliderline = document.querySelector(`#${el.id} .sliderline`)
        const slidermark = document.querySelector(`#${el.id} .slidermark`)
        if (el.id in inputData) {
            slidermark.style.width = inputData[el.id].data
        } else {
            inputData[el.id] = {'type': 'slide','data': '0%'}
        }
        inputData[el.id].mark = slidermark
        inputData[el.id].bounds = sliderline.getBoundingClientRect()

        console.log(inputData[el.id])

        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "slider").id
            const elem = inputData[elId]
            const loc = e.x - elem.bounds.x;
            const perc = 100*Math.max(0, Math.min(1, loc / elem.bounds.width));
            elem.data = `${Math.round(perc)}%`;
            console.log(elem.data)
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
            if (!(e.ctrlKey && e.shiftKey)||!elem.data){
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

    // Handle selection from dropdown
    select.addEventListener('change', (e) => {
        const key = e.target.value;
        if (!key || !savedData[key]) return;

        const confirmSave = confirm("Do you want to save your current work before switching?");
        if (confirmSave) { saveBtn.click() }

        storage = savedData[key].s;
        imageStorage = savedData[key].i;
        storageKey = key;

        readStorage();
    });


    // Save button click handler
    saveBtn.addEventListener('click', () => {
        const charName = sanitizeName(storage.text?.['in-name'] || 'unknown');
        const uuid = shortUUID();
        const key = `CHARTAB_store_n${charName}_${uuid}`;
        const imgKey = `${key}_img`;
        
        localStorage.setItem(key, JSON.stringify(storage));
        localStorage.setItem(imgKey, imageStorage);
        savedData[key] = getStorage(key);
        populateSaveDropdown();
    });

    setStorage()
})

