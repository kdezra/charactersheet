const inputData = {}
const savedData = {}
const keyMap = {}
const baseKey = "chartable"

let storage = {'radio':{}, 'slide':{}, 'text':{}, 'check':{}}
let storageKey = "chartable"
let imgStorage = null;

const fileInput = document.getElementById('portrait-input');
const image = document.getElementById('portrait');
const clearBtn = document.getElementById('portrait-clear');
const resetBtn = document.getElementById('reset-btn');
const downloadBtn = document.getElementById('download-btn');
const saveBtn = document.getElementById('save-btn');
const removeBtn = document.getElementById('remove-btn');
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
    window.localStorage.setItem(`${baseKey}_img`, imgStorage)
    window.localStorage.setItem(baseKey, storeString)
}

function getStorage(skey=null) {
    storeKey = skey||storageKey
    const tempStorage = {'i':null,'s':{'radio':{}, 'slide':{}, 'text':{}, 'check':{}}}
    if (!(storeKey in window.localStorage)) {
        return tempStorage
    }
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
}
function readStorage() {
    for (elType in storage) {
        let typeIds = storage[elType]
        for (key in typeIds) {
            inputData[key] = {'type': elType, 'data': typeIds[key]}
        }
    }
}

function resetAll() {
    storage = {'radio':{}, 'slide':{}, 'text':{}, 'check':{}}
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
    storageKey = baseKey
    populateSaveDropdown()
    removeBtn.setAttribute('style', 'display:none')
    setStorage()
}

function populateSaveDropdown() {
  select.innerHTML = ''; // Clear
  const defaultOpt = document.createElement('option');
  defaultOpt.textContent = 'Select Saved';
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  select.appendChild(defaultOpt);

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${baseKey}_n`) && !key.endsWith('_img')) {
      if (!(key in savedData)) {
        savedData[key] = getStorage(key);
      }
      const name = savedData[key]?.s?.text?.['in-name'] || '(no name)';
      const option = document.createElement('option');
      option.value = key;
      option.textContent = name;
      if (storageKey != baseKey && storageKey == key) {
        option.selected = true
        defaultOpt.selected = false
      }
      select.appendChild(option);
    }
  }
}

function ignoreElement(element) {
    if (element.hasAttribute('placeholder')) {
        if (!element.value) {
            return true
        }
    }
    if (element.className?.split(" ")?.includes("ignore")) {
        return true
    }
    return false
}

function downloadSave() {
    html2canvas(document.body, {
        windowWidth: 650,
        windowHeight: document.body.scrollHeight - 42,
        ignoreElements: ignoreElement
    }).then(function(canvas) {
        let img = canvas.toDataURL("image/png");
        let a = document.createElement('a');
        a.href = img;
        a.download = `${storageKey}.jpg`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove()
    })
}

document.addEventListener("DOMContentLoaded", (event) => {
    const tempStorage = getStorage()
    storage = tempStorage.s
    imgStorage = tempStorage.i
    readStorage()
    populateSaveDropdown()

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

    downloadBtn.addEventListener('click', downloadSave)
    resetBtn.addEventListener('click', () => {
        const confirmSave = confirm("Are you sure you would like to make a new character? Unsaved data will be lost.");
        if (confirmSave){
            resetAll()
        }
    })
    removeBtn.addEventListener('click', () => {
        const confirmSave = confirm("Are you sure you would like to remove this character? Unsaved data will be lost.");
        if (confirmSave){
            window.localStorage.removeItem(storageKey)
            window.localStorage.removeItem(`${storageKey}_img`)
            resetAll()
        }
    })

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

        el.addEventListener("click", (e) => {
            const elId = findParent(e.target, "slider").id
            const elem = inputData[elId]
            const loc = e.x - elem.bounds.x;
            const perc = 100*Math.max(0, Math.min(1, loc / elem.bounds.width));
            elem.data = `${Math.round(perc)}%`;
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

        const confirmSave = confirm("Are you sure you would like to switch characters? Unsaved data will be lost.");
        if (confirmSave) {
            storage = savedData[key].s;
            imgStorage = savedData[key].i;
            storageKey = key;

            readStorage();
        }
        removeBtn.setAttribute('style','');
    });


    // Save button click handler
    saveBtn.addEventListener('click', () => {
        let key = storageKey;
        if (storageKey == baseKey) {
            const charName = sanitizeName(storage.text?.['in-name'] || 'unknown');
            const uuid = shortUUID();
            key = `${baseKey}_n${charName}_${uuid}`;
        }
        
        localStorage.setItem(key, JSON.stringify(storage));
        localStorage.setItem(`${key}_img`, imgStorage);
        savedData[key] = getStorage(key);
        populateSaveDropdown();
        removeBtn.setAttribute('style','');
    });

    setStorage()
})

