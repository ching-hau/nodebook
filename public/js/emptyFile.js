
if(!socket){
    const socket = io();
}
let dragData;

// Function for event
const insertAfter = (newNode, existingNode) => {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

const getCurrentStyle = () => {
    const currentStatus = document.querySelector("label.active").innerText;
    const darkModeStatus = document.querySelector("#darkMode").parentNode.className.indexOf("off");
    let color1;
    let color2;
    if(darkModeStatus === -1){
        color1 = "background-color: white; color: black;"
        color2 = "background-color: #D3D3D3; color: black;"
    }else{
        color1 = "background-color: black; color:white;"
        color2 = "background-color: #666666; color:white;"
    }
    let fontSize;
    switch(currentStatus){
        case "L-Text":
            fontSize = "130%;font-weight:bold;" + color1
            break;
        case "M-Text":
            fontSize = "120%;" + color1;
            break;
        case "S-Text":
            fontSize = "100%;" + color1
            break;
            case "Coding":
            fontSize = "90%; padding: 10px;" + color2
            break;
    }
    return fontSize;
}

// Function for event

const dragStart = (e) => {
    let allItem = document.querySelectorAll(".movable");
    let index = Array.from(allItem).indexOf(e.target);
    e.dataTransfer.setData('text/plain', index);
    dragData = index
}

const positionJudge = (e) => {
    let lastDivP1 = document.querySelector(".currentPosition");
    let lastDivP2 = document.querySelector(".currentLastPosition");
    if(lastDivP1){
        lastDivP1.classList.remove("currentPosition")
    }
    if(lastDivP2){
        lastDivP2.classList.remove("currentLastPosition")
    }
    let allMovalbleDiv = document.querySelectorAll("p.newText")
    let currentIndex = Array.from(allMovalbleDiv).indexOf(e.target);
    if(currentIndex > dragData){
        e.target.classList.add("currentLastPosition");
    }else if(currentIndex < dragData){
        e.target.classList.add("currentPosition");
    }
}


const dropped = (e) => {
    cancelDefault(e);
    let allCodeResult = document.querySelectorAll("#sepResult")
    let allItem = document.querySelectorAll(".movable");
    let allSet = document.querySelector('#allMovable');
    let droppedDiv = getCurrentDiv(allItem, e);
    let oldIndex = e.dataTransfer.getData('text/plain');
    let newIndex = Array.from(allItem).indexOf(droppedDiv);
    let lastDivP1 = document.querySelector(".currentPosition");
    let lastDivP2 = document.querySelector(".currentLastPosition");
    if(lastDivP1){
        lastDivP1.classList.remove("currentPosition")
    }
    if(lastDivP2){
        lastDivP2.classList.remove("currentLastPosition")
    }
    if(newIndex == (allItem.length-1)){
        allSet.insertBefore(allItem[oldIndex], originalInputForm);
        allCodeResult.forEach(element => element.remove());
        dragData=""
        socketUpdate();
    }
    else if(newIndex > oldIndex){
        allItem[oldIndex].remove();
        allSet.insertBefore(allItem[oldIndex], allItem[newIndex+1]);
        allCodeResult.forEach(element => element.remove());
        dragData="";
        socketUpdate()
    }else if(newIndex < oldIndex){
        allItem[oldIndex].remove();
        allSet.insertBefore(allItem[oldIndex], allItem[newIndex]);
        allCodeResult.forEach(element => element.remove());
        dragData="";
        socketUpdate();
    }
}

const cancelDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

const autoResize = (e) => {
    let height = e.target.scrollHeight;
    // e.target.style.height = 'auto';
    e.target.style.height = height + 'px';
}

const getCurrentDiv = (allItem, e) => {
    let currentDiv;
    allItem.forEach(element => {
        if(element.contains(e.target)){
            currentDiv = element;
        }
    });
    return currentDiv;
}

const getCorrectFormat = (e) => {
    e.target.style = "font-size:" + getCurrentStyle()
}

const modifyTitle = (e) => {
    e.preventDefault();
    let title = document.querySelector("#titleInput").value;
    if(title.length >= 25){
        alert("Please keep your title less than 25.")
    }
    if(title != ""){
        appendTitle(title);
        const pageTitle = document.querySelector("title")
        pageTitle.innerText = title
        socketUpdate();
        e.target.remove();
    }
}

const transToForm = (e) => {
    let allItem = document.querySelectorAll(".movable");
    let currentDiv = getCurrentDiv(allItem, e);
    let allFormNumber = document.querySelectorAll(".inputForm").length;
    if(e.target.className === "newText coding"){
        removeButton(e)
    }
    if(e.target.tagName == "P" && allFormNumber <2){
        let originalText = e.target.innerHTML.replace(/<br>/g, "\n")
        let currentHeight = (e.target.scrollHeight)*1.2
        originalInputForm.style.display = "none"
        e.target.replaceWith(modifyText(originalText, currentDiv, currentHeight))  
    }
}

const submitOriginalForm = (e) => {
    const textArea = document.querySelector("textarea");
    const originalInputForm = document.querySelector("#inputForm")
    e.preventDefault();
    let inputContent = textArea.value;
    if(inputContent != ""){
        appendText(inputContent, originalInputForm);
        textArea.value = "";
        socketUpdate();
    }
}

//Create Element
const appendText = (text, insertPos) => {
    const allInputDiv = document.querySelector("#allMovable");
    const inputTextDiv = document.createElement("div");
    const inputTextP = document.createElement("p");
    inputTextDiv.draggable = "true";
    inputTextP.innerText = text;
    inputTextP.classList.add("newText");
    inputTextP.classList.add("text-left");
    inputTextP.style = "font-size:" + getCurrentStyle();
    inputTextDiv.append(inputTextP);
    addCodingClass(inputTextP, inputTextDiv)
    inputTextDiv.classList.add("movable");
    inputTextDiv.addEventListener('dragstart', dragStart);
    inputTextDiv.addEventListener('drop', dropped);
    inputTextDiv.addEventListener('dragenter', positionJudge);
    inputTextDiv.addEventListener('dragover', cancelDefault);
    allInputDiv.insertBefore(inputTextDiv, insertPos);
}

const appendTitle = (text) => {
    const titleDiv = document.querySelector("#title");
    const titleChildDiv = document.createElement("div");
    const titleInputForm = document.querySelector("#titleForm");
    titleChildDiv.innerText = text;
    titleChildDiv.classList.add("h1");
    titleChildDiv.id = "childTitle"
    titleDiv.append(titleChildDiv);
    titleInputForm.remove()
    titleChildDiv.addEventListener("click", createTitleForm)
}

const modifyText = (originalText, insertPos, currentHeight) => {
    const newInputForm = document.createElement("form");
    const newTextArea = document.createElement("textarea");
    const newEnterButton = document.createElement("button");
    newInputForm.id = "newForm";
    newInputForm.classList.add("form-group");
    newInputForm.classList.add("inputForm");
    newTextArea.rows = "1";
    newTextArea.cols = "30";
    newTextArea.classList.add("form-control");
    newTextArea.classList.add("form-control-v2");
    newTextArea.style = "font-size:" + getCurrentStyle();
    newTextArea.style.height = currentHeight + "px";
    newTextArea.addEventListener("input", autoResize)
    newTextArea.addEventListener("click", autoResize)
    newTextArea.innerHTML = originalText;
    newEnterButton.innerText = "ENTER";
    newEnterButton.classList.add("btn");
    newEnterButton.classList.add("btn-dark");
    newEnterButton.classList.add("enter");
    newEnterButton.id = "enterBtn";
    newInputForm.append(newTextArea);
    newInputForm.append(newEnterButton);
    newInputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputText = e.target.innerText;
        if(inputText != ""){
            appendText(newTextArea.value, insertPos);
            originalInputForm.style = "display:block";
            e.target.parentNode.remove()
        }
        socketUpdate();
    })
    return newInputForm;
}


const addCodingClass = (inputTextP, motherDiv) => {
    const currentStatus = document.querySelector("label.active").innerText;
    if(currentStatus == "Coding"){
        inputTextP.classList.add("coding");
        // here
        // inputTextP.classList.add("inline-control");
        // motherDiv.classList.add("form-group");
        // done
        const codingButton = document.createElement("button");
        codingButton.classList.add("codingBtn");
        codingButton.classList.add("btn-outline-dark");
        codingButton.classList.add("btn");
        codingButton.classList.add("myButton");
        codingButton.innerText = "RUN";
        codingButton.addEventListener("click", socketRunCodeSep);
        insertAfter(codingButton, inputTextP)
    }
}

const createTitleForm = (e) => {
    let titleNewForm = document.createElement("form");
    let titleNewInput = document.createElement("input");
    let originalTitle = e.target.innerText
    titleNewForm.id = "titleForm";
    titleNewInput.id = "titleInput";
    titleNewInput.style="height:50px; font-size:2em;"
    titleNewInput.classList.add("form-control");
    titleNewInput.placeholder = "Name of this note.";
    titleNewInput.value = originalTitle;
    titleNewForm.append(titleNewInput)
    e.target.parentNode.append(titleNewForm);
    titleNewForm.addEventListener("submit", modifyTitle);
    e.target.remove();
}


const removeButton = (e) => {
    let allCodingButton = document.querySelectorAll("button.codingBtn");
    let allCodingLi = document.querySelectorAll("p.coding");
    let currentCodingIndex = Array.from(allCodingLi).indexOf(e.target);
    allCodingButton[currentCodingIndex].remove();
}

    
const getCode = () => {
    let allCodeLi = document.querySelectorAll("p.coding")
    let allCode = ""
    allCodeLi.forEach(element => allCode+=element.innerText)
    return {"content": allCode.toString(), "file": Date.now().toString()}
}

const getCurrentCode = (e) => {
    let allCodingButton = document.querySelectorAll("button.codingBtn");
    let allCodingLi = document.querySelectorAll("p.coding");
    let currentBtnIndex = Array.from(allCodingButton).indexOf(e.target);
    if(e.target.previousSibling.id == "sepResult"){
        e.target.previousSibling.remove();
    }
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
//////////
const insertWaiting = (e) => {
    const waitingDiv = document.createElement("div");
    const waitingSpan = document.createElement("span");
    waitingDiv.classList.add("spinner-border");
    waitingDiv.role = "status";
    waitingSpan.classList.add("sr-only");
    waitingDiv.append(waitingSpan)
    e.target.parentNode.appendChild(waitingDiv);
}


const insertSocektResultSep = (result, index) => {
    //ddd
    const waitingDiv = document.querySelector(".spinner-border");
    waitingDiv.remove();
    //ddd
    const codingResultDiv = document.createElement("div");
    const currentCodingLi = document.querySelectorAll("p.coding")[index];
    const allInputDiv = document.querySelectorAll("#allMovable");
    allInputDiv.forEach(element => {
        if(element.contains(currentCodingLi)){
            currentDiv = element;
        }
    });
    codingResultDiv.id = "sepResult";
    codingResultDiv.classList.add("text-left");
    codingResultDiv.innerText = "[Output]:\n" + result;
    const darkMode = document.querySelector(".off")
    if(darkMode){
        codingResultDiv.style.borderColor = "white"
    }else{
        codingResultDiv.style.borderColor = "black"
    }
    
    insertAfter(codingResultDiv, currentCodingLi);
    socketUpdate();
}

const socketRunCodeSep = (e) => {
    let data = getCurrentCode(e);
    socket.emit("send code", data)
    insertWaiting(e);
}

socket.on("send reult", (data) => {
    let {result, index} = data;
    insertSocektResultSep(result, index);
});

const addEventToSingleItem = (action, element, func) => {
    if(element){
        element.addEventListener(action, func);
    }
}

const addEventToMultiItems = (action, elements, func) => {
    if(elements.length >0){
        elements.forEach(element => element.addEventListener(action, func))
    }
}


const originalInputForm = document.querySelector("#inputForm")
const textArea = document.querySelector("textarea");
const allInputDiv = document.querySelector("#allMovable");
const titleInputForm = document.querySelector("#titleForm");
const childTitleDiv = document.querySelector("#childTitle");


addEventToSingleItem("input", textArea, autoResize);
addEventToSingleItem("click", textArea, getCorrectFormat);
addEventToSingleItem("submit", titleInputForm, modifyTitle);
addEventToSingleItem("click", allInputDiv, transToForm);
addEventToSingleItem("submit", originalInputForm, submitOriginalForm);
addEventToSingleItem("click", childTitleDiv, createTitleForm)

const allMovalbleDiv = document.querySelectorAll(".movable");
const allCodingBtn = document.querySelectorAll(".codingBtn");

addEventToMultiItems("dragstart", allMovalbleDiv, dragStart);
addEventToMultiItems("drop", allMovalbleDiv, dropped);
addEventToMultiItems("dragenter", allMovalbleDiv, positionJudge);
addEventToMultiItems("dragover", allMovalbleDiv, cancelDefault);
addEventToMultiItems("click", allCodingBtn, socketRunCodeSep);



function addEventToExistedItems(){
    const originalInputForm = document.querySelector("#inputForm")
    const textArea = document.querySelector("textarea");
    const allInputDiv = document.querySelector("#allMovable");
    const titleInputForm = document.querySelector("#titleForm");
    const childTitleDiv = document.querySelector("#childTitle");
    
    addEventToSingleItem("input", textArea, autoResize);
    addEventToSingleItem("click", textArea, getCorrectFormat);
    addEventToSingleItem("submit", titleInputForm, modifyTitle);
    addEventToSingleItem("click", allInputDiv, transToForm);
    addEventToSingleItem("submit", originalInputForm, submitOriginalForm);
    addEventToSingleItem("click", childTitleDiv, createTitleForm)
    
    const allMovalbleDiv = document.querySelectorAll(".movable");
    const allCodingBtn = document.querySelectorAll(".codingBtn");
    
    addEventToMultiItems("dragstart", allMovalbleDiv, dragStart);
    addEventToMultiItems("drop", allMovalbleDiv, dropped);
    addEventToMultiItems("dragenter", allMovalbleDiv, positionJudge);
    addEventToMultiItems("dragover", allMovalbleDiv, cancelDefault);
    addEventToMultiItems("click", allCodingBtn, socketRunCodeSep);
}

// Socket General function
const socketEmitEvent = (event, obj) => {
    if(projectID){
        socket.emit(event, obj)
    }
}
const updateStatus = () => {
    const titleHTML = document.querySelector("#title").innerHTML;
    const contentHTML = document.querySelector("#allMovable").innerHTML;
    const pageTitle = document.querySelector("title").innerText;
    return {title: titleHTML, content: contentHTML, pageTitle: pageTitle}
}



function changeClass(array, oldClass, newClass, mode){
    array.forEach(element => {
        element.classList.add(newClass);
        element.classList.remove(oldClass);
        if(mode === "dark"){
            element.style.backgroundColor = "black";
            element.style.color = "white";
        } else if( mode ==="normal"){
            element.style.backgroundColor = "#f8f9fa";
            element.style.color = "black";
        }
    })
}



const darkSwitch = (e) => {
    const otherItems = document.querySelector(".otherItems")
    const sun = document.querySelector(".sun");
    const moon = document.querySelector(".moon");
    const body = document.querySelector("body");
    const newText = document.querySelectorAll(".newText");
    const motherDiv = document.querySelector("#motherDiv");
    const codingArea = document.querySelectorAll(".coding");
    const sepResultArea = document.querySelectorAll("#sepResult");
    const inputArea = document.querySelector("#inputArea");
    const dropDownMenu = document.querySelector(".dropdown-menu");
    const dropDownItems = document.querySelectorAll(".dropdown-item");
    const titleInput = document.querySelector("#titleInput")
    if(e.target.className.indexOf("off") == -1){
        const allBg = document.querySelectorAll(".bg-light");
        const allBtn = document.querySelectorAll(".btn-light");
        changeClass(allBg, "bg-light", "bg-black", "dark")
        changeClass(allBtn, "btn-light", "btn-black", "dark")
        sun.style.display = "none";
        moon.style.display = "block";
        body.style.backgroundColor = "black"
        motherDiv.style.color = "white"
        newText.forEach(element => {
            element.style.backgroundColor = "black"
            element.style.color = "white"
        })
        codingArea.forEach(element => {
            element.style.backgroundColor = "#666666"
        });
        sepResultArea.forEach(element => {
            element.style.borderColor = "white"
        });
        dropDownItems.forEach(element => {
            element.style.color = "rgba(255, 255, 255)"
        });
        if(inputArea){
            inputArea.style.backgroundColor = "black";
        }
        if(dropDownMenu){
            dropDownMenu.style.backgroundColor = "black";
        }
        if(dropDownMenu){
            dropDownMenu.style.borderColor = "white";
        }
        if(otherItems){
            otherItems.style.color = "rgba(255, 255, 255, .5)"
        }
        if(titleInput){
            titleInput.style.backgroundColor = "black";
            titleInput.style.color = "white";
        }
    }else {
        const allBg = document.querySelectorAll(".bg-black");
        const allBtn = document.querySelectorAll(".btn-black");
        changeClass(allBg, "bg-black", "bg-light", "normal");
        changeClass(allBtn, "btn-black", "btn-light", "normal");
        sun.style.display = "block";
        moon.style.display = "none";
        body.style.backgroundColor = "white";
        motherDiv.style.color = "black";
        newText.forEach(element => {
            element.style.backgroundColor = "white"
            element.style.color = "black"
        })
        codingArea.forEach(element => {
            element.style.backgroundColor = "#D3D3D3"
        });
        sepResultArea.forEach(element => {
            element.style.borderColor = "black"
        });
        dropDownItems.forEach(element => {
            element.style.color = "rgba(0, 0, 0)"
        });
        if(inputArea){
            inputArea.style.backgroundColor = "white";
        }
        if(dropDownMenu){
            dropDownMenu.style.backgroundColor = "white";
        }
        if(dropDownMenu){
            dropDownMenu.style.borderColor = "black";
        }
        if(otherItems){
            otherItems.style.color = "rgba(0, 0, 0, .5)"
        }
        if(titleInput){
            titleInput.style.backgroundColor = "white";
            titleInput.style.color = "black";
        }
    }
}
const emitChangingMode = () => {
    const offDiv = document.querySelector(".off");
    if(offDiv){
        socket.emit("click to change mode", "normal");
    }else{
        socket.emit("click to change mode", "dark");
    }
    
}
socket.on("change mode syn", (e) => {
    darkSwitch(e);
    const darkModeBtnMother = document.querySelector("#darkMode").parentNode;
    if(e.target.className.indexOf("off") != -1 && darkModeBtnMother.className.indexOf("off") != -1){
        darkModeBtnMother.classList.remove("off")
    }else if(e.target.className.indexOf("off") == -1 && darkModeBtnMother.className.indexOf("off") == -1){
        darkModeBtnMother.classList.add("off")
    }
})



const darkSwitchInput = document.querySelector("#darkMode");
darkSwitchInput.parentNode.addEventListener("click", darkSwitch)
darkSwitchInput.parentNode.addEventListener("click", emitChangingMode)





// Socket on event
if(projectID){
    socket.on("join room", (msg) => {
    });
    socket.on("update or not", (msg) => {
        let currentContent = updateStatus();
        socket.emit("the latest status", currentContent)
    });
    socket.on("update the content", (result) => {
        document.querySelectorAll("#movable").forEach(element => {
            element.remove()
        });
        document.querySelector("#childTitle").remove()
        let titleDiv = document.querySelector("#title");
        let movableDiv = document.querySelector("#allMovable");
        let pageTitle = document.querySelector("title");
        titleDiv.innerHTML = result.title;
        movableDiv.innerHTML = result.content;
        pageTitle.innerText = result.pageTitle;
        addEventToExistedItems()
    })
}


socketEmitEvent("start to connect", projectID);
const socketUpdate = () => {
    let currentContent = updateStatus();
    socketEmitEvent("the latest status", currentContent)
}

socket.on("update user list", () => {
    window.location.reload();
})

if(!projectID){
    socket.emit("new project connected")
}