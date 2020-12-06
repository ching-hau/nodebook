const socket = io();
const originalInputForm = document.querySelector("#inputForm")
const textArea = document.querySelector("textarea");
const allInputDiv = document.querySelector("#allMovable");
const titleInputForm = document.querySelector("#titleForm")


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

function appendTitle(text){
    const titleDiv = document.querySelector("#title");
    const titleChildDiv = document.createElement("div");
    console.log(text)
    titleChildDiv.innerText = text;
    titleChildDiv.id = "childTitle"
    titleDiv.append(titleChildDiv);
    titleInputForm.remove()
    titleChildDiv.addEventListener("click", createTitleForm)
}

function modifyText(originalText, insertPos, currentHeight){
    const newInputForm = document.createElement("form");
    const newTextArea = document.createElement("textarea");
    const newEnterButton = document.createElement("button");
    newInputForm.id = "newForm";
    newTextArea.rows = "10";
    newTextArea.cols = "30";
    newTextArea.style = "font-size:" + getCurrentStyle()
    newTextArea.style.height = currentHeight + "px";
    newTextArea.innerHTML = originalText;
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

function createTitleForm(e){
    let titleNewForm = document.createElement("form");
    let titleNewInput = document.createElement("input");
    let originalTitle = e.target.innerText
    titleNewForm.id = "titleForm";
    titleNewInput.id = "titleInput";
    titleNewInput.placeholder = "Name of this note.";
    titleNewInput.value = originalTitle;
    titleNewForm.append(titleNewInput)
    e.target.parentNode.append(titleNewForm);
    titleNewForm.addEventListener("submit", modifyTitle);
    e.target.remove();
}

function dragStart(e){
    let allItem = document.querySelectorAll(".movable");
    let index = Array.from(allItem).indexOf(e.target);
    e.dataTransfer.setData('text/plain', index);
}

function dropped(e){
    cancelDefault(e);
    let allCodeResult = document.querySelectorAll("#sepResult")
    let allItem = document.querySelectorAll(".movable");
    let allSet = document.querySelector('#allMovable');
    let droppedDiv = getCurrentDiv(allItem, e);
    let oldIndex = e.dataTransfer.getData('text/plain');
    let newIndex = Array.from(allItem).indexOf(droppedDiv);
    if(newIndex == (allItem.length-1)){
        console.log("it is here")
        allSet.insertBefore(allItem[oldIndex], originalInputForm);
        allCodeResult.forEach(element => element.remove())
    }
    else if(newIndex > oldIndex){
        allItem[oldIndex].remove();
        allSet.insertBefore(allItem[oldIndex], allItem[newIndex+1]);
        allCodeResult.forEach(element => element.remove())
    }else if(newIndex < oldIndex){
        allItem[oldIndex].remove();
        allSet.insertBefore(allItem[oldIndex], allItem[newIndex]);
        allCodeResult.forEach(element => element.remove())
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

function modifyTitle (e){
    e.preventDefault();
    let title = document.querySelector("#titleInput").value;
    if(title != ""){
        appendTitle(title);
        e.target.remove()
    }
}

titleInputForm.addEventListener("submit", modifyTitle);


allInputDiv.addEventListener("click", (e) => {
    let allItem = document.querySelectorAll(".movable");
    let currentDiv = getCurrentDiv(allItem, e);
    if(e.target.className === "newText coding"){
        removeButton(e)
    }
    if(e.target.tagName == "P"){
        let originalText = e.target.innerHTML.replace(/<br>/g, "\n")
        let currentHeight = e.target.scrollHeight
        originalInputForm.style.display = "none"
        e.target.replaceWith(modifyText(originalText, currentDiv, currentHeight))  
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
    allInputDiv.forEach(element => {
        if(element.contains(currentCodingLi)){
            currentDiv = element;
        }
    });
    codingResultDiv.id = "sepResult";
    codingResultDiv.innerText = "[Output]:\n" + result;
    insertAfter(codingResultDiv, currentCodingLi);
}

// function socketRunCode(){
//     console.log("socket run code");
//     let data = getCode();
//     console.log(data)
//     socket.emit("send code", data)
//     insertSocketResult("");
// }

function socketRunCodeSep(e){
    console.log("socket run code separately");
    let data = getCurrentCode(e);
    socket.emit("send code", data)
    //insertSocektResultSep("", e.index);;
}

socket.on("send reult", (data) => {
    let {result, index} = data;
    console.log(result)
    insertSocektResultSep(result, index);
});