const originalFormForm = document.querySelector("#originalForm");
const newFormForm = document.querySelector("#newForm");
const allContentDiv = document.querySelector(".allContent");
const textareaContent = document.querySelector("textarea");
let i =0;

function appendText(text, insertPosition){
    const inputTextDiv = document.createElement("li");
    inputTextDiv.innerText = text;
    inputTextDiv.id = "element";
    inputTextDiv.classList.add("newText");
    addCodingClass(inputTextDiv)
    inputTextDiv.style = "font-size:" + getCurrentStyle();
    inputTextDiv.draggable = "true";
    inputTextDiv.addEventListener('dragstart', dragStart);
    inputTextDiv.addEventListener('drop', dropped);
    inputTextDiv.addEventListener('dragenter', cancelDefault);
    inputTextDiv.addEventListener('dragover', cancelDefault);
    allContentDiv.insertBefore(inputTextDiv, insertPosition);
    addRunButton(allContentDiv, insertPosition, "coding");
}

function getCurrentStyle(){
    const currentStatus = document.querySelector("#catagory").value;
    let fontSize;
    switch(currentStatus){
        case "title":
            fontSize = "130%;font-weight:bold;"
            break;
        case "subTitle":
            fontSize = "120%"
            break;
        case "text":
            fontSize = "100%"
            break;
        default:
            fontSize = "90%;background-color: #D3D3D3;"
            break;
    }
    return fontSize;
}

function addCodingClass(inputTextDiv){
    const currentStatus = document.querySelector("#catagory").value;
    if(currentStatus == "coding"){
        inputTextDiv.classList.add("coding");
    }
}


function modifyText(originalText){
    const newForm = document.createElement("form");
    const newTextArea = document.createElement("textarea");
    const newFormButton = document.createElement("button");



    newForm.id = "newForm";
    newTextArea.rows = "10";
    newTextArea.cols = "30";
    newTextArea.style = "font-size:" + getCurrentStyle()
    newTextArea.innerText = originalText;
    newFormButton.innerText = "ENTER";
    newFormButton.classList.add("myButton");
    newFormButton.id = "enter";
    newForm.appendChild(newTextArea)
    newForm.appendChild(newFormButton)
    newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = e.target.innerText;
        if(text != ""){
            appendText(newTextArea.value, newForm);
            originalFormForm.style = "display:block";
            newForm.remove();
        }
    });

    return newForm;
}

originalFormForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = textareaContent.value;
    if(text != ""){
        appendText(text, originalFormForm);
        textareaContent.value = "";
    }
});

// let allCodingButton = document.querySelectorAll("button.coding");
// let allCodingLi = document.querySelectorAll("li.coding");
// let currentBtnIndex = Array.from(allCodingButton).indexOf(e.target);


allContentDiv.addEventListener("click", (e) => {
    let allButtonCount = document.querySelectorAll("#enter").length
    console.log(e.target.className === "newText coding")
    //let allCodingButton = document.querySelector("button.coding")
    // console.log(allCodingButton)
    if(e.target.className === "newText coding"){
        removeButton(e)
    }
    if((e.target.tagName == "LI")&&(e.target.id=="element")&&(allButtonCount==1)){
        let originalText = e.target.innerText;
        originalFormForm.style.display = "none"
        e.target.replaceWith(modifyText(originalText))  
    }
});

function removeButton(e){
    let allCodingButton = document.querySelectorAll("button.coding");
    let allCodingLi = document.querySelectorAll("li.coding");
    let currentCodingIndex = Array.from(allCodingLi).indexOf(e.target);
    allCodingButton[currentCodingIndex].remove();
}


textareaContent.addEventListener("click", (e) => {
    e.target.style = "font-size:" + getCurrentStyle()
})


function dragStart(e){
    let allItem = document.querySelectorAll('#items-list > li')
    let index = Array.from(allItem).indexOf(e.target);
    e.dataTransfer.setData('text/plain', index);
}

function dropped(e){
    cancelDefault(e)
    let allItem = document.querySelectorAll('#items-list > li')
    let allSet = document.querySelector('#items-list')
    let oldIndex = e.dataTransfer.getData('text/plain')
    let newIndex = Array.from(allItem).indexOf(e.target)
    if(newIndex != oldIndex){
        allItem[oldIndex].remove()
        allSet.insertBefore(allItem[oldIndex], allItem[newIndex])
    }
}


  
function cancelDefault(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function getCode(){
    let allCodeLi = document.querySelectorAll("li.coding")
    let allCode = ""
    allCodeLi.forEach(element => allCode+=element.innerHTML)
    return {"content": allCode.toString(), "file": Date.now().toString()}
}

function insertCodeResult(result){
    let codeResultDiv = document.querySelector(".codeResult");
    codeResultDiv.innerText = result.result;
}

async function runCode(){
    let data = getCode()
    let config = {
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    let result = await fetch("/childprocess/test", config)
    .then(res => {
        if(res.status == 200){
            return res.json()
        }else{
            return {result:"fail"}
        }
    })
    insertCodeResult(result)
}

function getCurrentCode(e){
    let allCodingButton = document.querySelectorAll("button.coding");
    let allCodingLi = document.querySelectorAll("li.coding");
    let currentBtnIndex = Array.from(allCodingButton).indexOf(e.target);
    console.log("get code")
    let allCode = "";
    for(let i = 0; i <= currentBtnIndex; i++){
        allCode += allCodingLi[i].innerHTML;
    }

    return {"content": allCode.toString(), "file": Date.now().toString()}
}

async function runSepCode(e){
    console.log("run code")
    let data = getCurrentCode(e)
    console.log(data)
    let config = {
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    let result = await fetch("/childprocess/test", config)
    .then(res => {
        if(res.status == 200){
            console.log(res)
            return res.json()
        }else{
            return {result:"fail"}
        }
    })
    insertCodeResult(result)
}







function addCodingClass(inputTextDiv){
    const currentStatus = document.querySelector("#catagory").value;
    if(currentStatus == "coding"){
        inputTextDiv.classList.add("coding");
    }
}



function addRunButton(div1, div2, currentElement){
    const currentStatus = document.querySelector("#catagory").value;
    if(currentStatus == "coding"){
        const codingButton = document.createElement("button");
        codingButton.classList.add(currentElement);
        codingButton.classList.add("myButton");
        codingButton.innerText = "RUN2";
        //codingButton.onclick = () => {runSepCode()}
        codingButton.addEventListener("click", (e) => {runSepCode(e)})
        div1.insertBefore(codingButton, div2)
    }
}

// const testDiv = document.querySelector(".test");
// const testDiv2 = document.querySelector(".test2");
// addRunButton(testDiv, testDiv2, "gg");


