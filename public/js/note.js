const appendTitle = (text) => {
    const titleDiv = document.querySelector("#title");
    const titileForm = document.querySelector("#titleForm");
    const titleChildP = document.createElement("p");
    titleChildP.innerText = text;
    titleChildP.id = "childTitle"
    titleChildP.classList.add("h1");
    titleChildP.classList.add("text-left");
    titleDiv.append(titleChildP);
    titileForm.remove();
    titleChildP.addEventListener("click", createTitleForm)
}

const appendText = (text, insertPos) => {
    const allInputDiv = document.querySelector("#allMovable"); 
    const inputTextDiv = document.createElement("div");
    const inputTextP = document.createElement("p");
    inputTextDiv.draggable = "true";
    inputTextP.innerText = text;
    inputTextP.classList.add(getCurrentStyle().pClass);
    inputTextP.classList.add("text-left");
    inputTextP.addEventListener("click", createInputForm)
    inputTextDiv.append(inputTextP);
    inputTextDiv.classList.add("movable");
    inputTextDiv.classList.add("movable");
    inputTextDiv.addEventListener("dragstart", dragStart);
    inputTextDiv.addEventListener("drop", dropped);
    inputTextDiv.addEventListener("dragenter", cancelDefault);
    inputTextDiv.addEventListener("dragover", cancelDefault);
    allInputDiv.insertBefore(inputTextDiv, insertPos);
}

// Function for repeated action
const getCurrentStyle = () => {
    const currentStatus = document.querySelector(".active").innerText;
    let inputStyle;
    let pClass;
    let coding;
    switch(currentStatus){
        case "L-Text":
            inputStyle = "height:50px; font-size:2em;";
            pClass = "h1";
            coding = "N"
            break;
        case "M-Text":
            inputStyle = "height:37.5px; font-size:1.5em;";
            pClass = "h2";
            coding = "N"
            break;
        case "S-Text":
            inputStyle = "height:29.25px; font-size:1.17em;";
            pClass = "h3";
            coding = "N"
            break;
            case "Coding":
            inputStyle = "height:29.25px; font-size:1.17em;";
            pClass = "h3";
            coding = "Y"
            break;
    }
    return {inputStyle: inputStyle, pClass: pClass, coding: coding}
}



//Event listener function
const createTitleForm = (e) => {
    const titleDiv = document.querySelector("#title");
    const titleNewForm = document.createElement("form");
    const titleNewInput = document.createElement("input");
    const originalTitle = e.target.innerText
    titleNewForm.id = "titleForm";
    titleNewInput.placeholder = "Title of this note.";
    titleNewInput.type = "text"
    titleNewInput.classList.add("form-control");
    titleNewInput.classList.add("titleInput");
    titleNewInput.style = "height:50px; font-size:2em;"
    titleNewInput.value = originalTitle;
    titleNewForm.append(titleNewInput)
    titleDiv.append(titleNewForm);
    titleNewForm.addEventListener("submit", modifyTitle);
    e.target.remove();
}

const createInputForm = (e) => {
    const allForms = document.querySelectorAll("form")
    if(allForms.length <=2 ){
        const allItem = document.querySelector("#allMovable");
        const oldInputForm = document.querySelector("#contentForm");
        const newInputForm = document.createElement("form");
        const newInputInput = document.createElement("input");
        newInputForm.id = "newContentForm";
        newInputInput.classList.add("form-control");
        newInputInput.classList.add("contentInput");
        newInputInput.style = getCurrentStyle().inputStyle;
        newInputInput.value = e.target.innerText;
        newInputForm.append(newInputInput);
        newInputForm.addEventListener("click", changeInputFormat);
        newInputForm.addEventListener("submit", modifyNewText);
        allItem.insertBefore(newInputForm, e.target.parentNode)
        e.target.parentNode.remove();
        oldInputForm.style = "display: none";
    }
}

const checkInputForm = (e) => {
    let currentMode = getCurrentStyle().coding;
    const contentForm = e.target.parentNode;
    if(currentMode == "N" && e.target.tagName != "INPUT"){
        console.log("N N I")
        document.querySelector(".enter").remove()
        const newInputInput = document.createElement("input");
        getIpTaProp(newInputInput, contentForm, e)
    } else if (currentMode == "Y" && e.target.tagName != "TEXTAREA") {
        console.log("Y N T")
        const newInputInput = document.createElement("textarea");
        getIpTaProp(newInputInput, contentForm, e);
    }
}

const getIpTaProp = (target, contentForm, e) => {
    target.classList.add("form-control");
    target.classList.add("contentInput");
    target.style = getCurrentStyle().inputStyle;
    target.value = e.target.innerText;
    contentForm.append(target)
    e.target.remove();
    contentForm.addEventListener("click", changeInputFormat);
    contentForm.addEventListener("submit", modifyNewText);
}

const modifyTitle = (e) => {
    e.preventDefault();
    let title = document.querySelector(".titleInput").value;
    if(title != ""){
        appendTitle(title);
        e.target.remove()
    }
}

const modifyText = (e) => {
    e.preventDefault();
    let contentInput = document.querySelector(".contentInput");
    let text = contentInput.value;
    if(text != ""){
        appendText(text, e.target)
        contentInput.value = "";
    }
}

const modifyNewText = (e) => {
    e.preventDefault();
    const newContentForm = document.querySelector("#newContentForm");
    const oldInputForm = document.querySelector("#contentForm");
    const text = document.querySelector(".contentInput").value;
    if(text != ""){
        appendText(text, newContentForm)
        newContentForm.remove()
        oldInputForm.style = "display: block";
    }
}

const createTextArea = (e) => {
    const textArea = document.createElement("textarea");
    textArea.cols = 50;
    textArea.rows = 3;
    textArea.classList.add("form-control");
    // textArea.style = getCurrentStyle().inputStyle;
    textArea.addEventListener('click', checkInputForm);
    textArea.addEventListener('input', autoResize);
    e.target.replaceWith(textArea)
}

const createButton = (form) => {
    const enterButton = document.createElement("button");
    enterButton.classList.add("btn");
    enterButton.classList.add("btn-outline-secondary");
    enterButton.classList.add("enter");
    enterButton.innerText = "ENTER";
    // enterButton.addEventListener("submit", modifyNewText)
    form.append(enterButton);
}

const changeInputFormat = (e) => {
    if(getCurrentStyle().coding == "Y" && e.target.tagName != "TEXTAREA"){
        const form = e.target.parentNode;
        createTextArea(e)
        createButton(form)
    }else{
        e.target.style = getCurrentStyle().inputStyle;
    }
}


const dragStart = (e) => {
    let allItem = document.querySelectorAll(".movable");
    let index = Array.from(allItem).indexOf(e.target);
    e.dataTransfer.setData('text/plain', index);
}

const dropped = (e) => {
    cancelDefault(e);
    let allCodeResult = document.querySelectorAll("#sepResult")
    let allItem = document.querySelectorAll(".movable");
    let allSet = document.querySelector('#allMovable');
    let droppedDiv = getCurrentDiv(allItem, e);
    let oldIndex = e.dataTransfer.getData('text/plain');
    let newIndex = Array.from(allItem).indexOf(droppedDiv);
    if(newIndex == (allItem.length-1)){
        console.log("it is here")
        allSet.insertBefore(allItem[oldIndex], contetInputForm);
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

const cancelDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
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

const autoResize = (e) => {
    e.target.style.height = 'auto';
    let height = e.target.scrollHeight;
    e.target.style.height = height + 'px';
}

// DOM element for add event listener
const titleInputForm = document.querySelector("#titleForm");
const contetInputForm = document.querySelector("#contentForm");
// const textareaForm = document.querySelector("#textareaForm")

// Add event listener
titleInputForm.addEventListener("submit", modifyTitle);
contetInputForm.addEventListener("submit", modifyText);
contetInputForm.addEventListener("click", changeInputFormat);
// textareaForm.addEventListener("input", autoResize, false);

