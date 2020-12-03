const socket = io();
const originalInputForm = document.querySelector("#inputForm")
const textArea = document.querySelector("textarea");
const allInputDiv = document.querySelector("#allMovable");

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function appendText(text, insertPos){
    const allInputDiv = document.querySelector("#allMovable");
    const inputTextDiv = document.createElement("div");
    const inputTextP = document.createElement("p");
    inputTextDiv.draggable = "true";
    inputTextP.innerText = text;
    inputTextP.classList.add("newText");
    inputTextP.style = "font-size:" + getCurrentStyle();
    // addCodingClass(inputTextP);
    inputTextDiv.append(inputTextP);
    addCodingClass(inputTextP, inputTextDiv)
    inputTextDiv.classList.add("movable");
    inputTextDiv.addEventListener('dragstart', dragStart);
    inputTextDiv.addEventListener('drop', dropped);
    inputTextDiv.addEventListener('dragenter', cancelDefault);
    inputTextDiv.addEventListener('dragover', cancelDefault);
    allInputDiv.insertBefore(inputTextDiv, insertPos);
}

function modifyText(originalText, insertPos){
    const newInputForm = document.createElement("form");
    const newTextArea = document.createElement("textarea");
    const newEnterButton = document.createElement("button");
    newInputForm.id = "newForm";
    newTextArea.rows = "10";
    newTextArea.cols = "30";
    newTextArea.style = "font-size:" + getCurrentStyle()
    newTextArea.innerText = originalText;
    newEnterButton.innerText = "ENTER";
    newEnterButton.classList.add("myButton");
    newEnterButton.id = "enter";
    newInputForm.append(newTextArea);
    newInputForm.append(newEnterButton);
    newInputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputText = e.target.innerText;
        if(inputText != ""){
            appendText(newTextArea.value, insertPos);
            originalInputForm.style = "display:block";
            // newInputForm.remove()
            e.target.parentNode.remove()
        }
    })
    return newInputForm;
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

function addCodingClass(inputTextP, motherDiv){
    const currentStatus = document.querySelector("#catagory").value;
    if(currentStatus == "coding"){
        inputTextP.classList.add("coding");
        const codingButton = document.createElement("button");
        codingButton.classList.add("coding");
        codingButton.classList.add("myButton");
        codingButton.innerText = "RUN";
        //codingButton.onclick = () => {runSepCode()}
        codingButton.addEventListener("click", (e) => {socketRunCodeSep(e)})
        //motherDiv.append(codingButton)
        insertAfter(codingButton, inputTextP)
    }
}

function dragStart(e){
    let allItem = document.querySelectorAll(".movable");
    let index = Array.from(allItem).indexOf(e.target);
    e.dataTransfer.setData('text/plain', index);
}

function dropped(e){
    cancelDefault(e)
    let allItem = document.querySelectorAll(".movable");
    let allSet = document.querySelector('#allMovable');
    let droppedDiv = getCurrentDiv(allItem, e);
    let oldIndex = e.dataTransfer.getData('text/plain');
    let newIndex = Array.from(allItem).indexOf(droppedDiv);
    if(newIndex == (allItem.length-1)){
        console.log("it is here")
        allSet.insertBefore(allItem[oldIndex], originalInputForm);
    }
    else if(newIndex > oldIndex){
        allItem[oldIndex].remove();
        allSet.insertBefore(allItem[oldIndex], allItem[newIndex+1]);
    }else if(newIndex < oldIndex){
        allItem[oldIndex].remove();
        allSet.insertBefore(allItem[oldIndex], allItem[newIndex]);
    }
}

function cancelDefault(e){
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function getCurrentDiv(allItem, e){
    let currentDiv;
    allItem.forEach(element => {
        if(element.contains(e.target)){
            currentDiv = element;
        }
    });
    return currentDiv;
}

function removeButton(e){
    let allCodingButton = document.querySelectorAll("button.coding");
    let allCodingLi = document.querySelectorAll("p.coding");
    let currentCodingIndex = Array.from(allCodingLi).indexOf(e.target);
    allCodingButton[currentCodingIndex].remove();
}

originalInputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputContent = textArea.value;
    if(inputContent != ""){
        appendText(inputContent, originalInputForm);
        textArea.value = "";
    }
});

allInputDiv.addEventListener("click", (e) => {
    let allItem = document.querySelectorAll(".movable");
    let currentDiv = getCurrentDiv(allItem, e);
    if(e.target.className === "newText coding"){
        removeButton(e)
    }
    if(e.target.tagName == "P"){
        let originalText = e.target.innerText;
        originalInputForm.style.display = "none"
        e.target.replaceWith(modifyText(originalText, currentDiv))  
    }
});

textArea.addEventListener("click", (e) => {
    e.target.style = "font-size:" + getCurrentStyle()
});

function getCode(){
    let allCodeLi = document.querySelectorAll("p.coding")
    let allCode = ""
    allCodeLi.forEach(element => allCode+=element.innerText)
    return {"content": allCode.toString(), "file": Date.now().toString()}
}

function getCurrentCode2(e){
    let allCodingButton = document.querySelectorAll("button.coding");
    let allCodingLi = document.querySelectorAll("p.coding");
    let currentBtnIndex = Array.from(allCodingButton).indexOf(e.target);
    console.log("here")
    console.log(e.target.previousSibling.id == "sepResult")
    if(e.target.previousSibling.id == "sepResult"){
        e.target.previousSibling.remove();
    }
    console.log("get code")
    let allCode = "";
    for(let i = 0; i <= currentBtnIndex; i++){
        allCode += allCodingLi[i].innerText;
    }
    return {"content": allCode.toString(), "file1": Date.now().toString(), "index": currentBtnIndex}
}

function getCurrentCode(e){
    let allCodingButton = document.querySelectorAll("button.coding");
    let allCodingLi = document.querySelectorAll("p.coding");
    let currentBtnIndex = Array.from(allCodingButton).indexOf(e.target);
    if(e.target.previousSibling.id == "sepResult"){
        e.target.previousSibling.remove();
    }
    console.log("get code")
    let allCode1 = "";
    let allCode2 = "";
    if(currentBtnIndex == 0){
        allCode1 += allCodingLi[0].innerText;
    }else{
        for(let i = 0; i <= (currentBtnIndex-1); i++){
            allCode1 += allCodingLi[i].innerText;
        }
        allCode2 = allCode1 + allCodingLi[currentBtnIndex].innerText;
    }
    return {"content1": allCode1.toString(),"content2": allCode2, "file1": Date.now().toString(), "file2": (Date.now()+1).toString(), "index": currentBtnIndex}
}


function insertSocketResult(result){
    let codeResultDiv = document.querySelector(".codeResult");
    codeResultDiv.innerText = result;
}

function insertSocektResultSep(result, index){
    const codingResultDiv = document.createElement("div");
    const currentCodingLi = document.querySelectorAll("p.coding")[index];
    const allInputDiv = document.querySelectorAll("#allMovable");
    let currentDiv;
    allInputDiv.forEach(element => {
        if(element.contains(currentCodingLi)){
            currentDiv = element;
        }
    });
    codingResultDiv.id = "sepResult";
    codingResultDiv.innerText = "[Output]:\n" + result;
    insertAfter(codingResultDiv, currentCodingLi);
}

function socketRunCode(){
    console.log("socket run code");
    let data = getCode();
    console.log(data)
    socket.emit("send code", data)
    insertSocketResult("");
}

function socketRunCodeSep(e){
    console.log("socket run code separately");
    let data = getCurrentCode(e);
    socket.emit("send code", data)
    insertSocketResult("");
}

socket.on("send reult", (data) => {
    console.log(data)
    let {result, index} = data;
    insertSocektResultSep(result, index);
});