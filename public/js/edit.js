const originalFormForm = document.querySelector("#originalForm");
const newFormForm = document.querySelector("#newForm");
const allContentDiv = document.querySelector(".allContent");
const textareaContent = document.querySelector("textarea");

function appendText(text, insertPosition){
    //div -li
    console.log(document.querySelector("#catagory").value)
    const inputTextDiv = document.createElement("li");
    inputTextDiv.innerText = text;
    inputTextDiv.id = `element`;
    inputTextDiv.classList.add("newText");
    addCodingClass(inputTextDiv)
    inputTextDiv.style = "font-size:" + getCurrentStyle();
    //console.log(inputTextDiv.style)
    //if(inputTextDiv.style["1"] == "background-color"){
    //    inputTextDiv.classList.add("code");
    //}
    inputTextDiv.draggable = "true";
    inputTextDiv.addEventListener('dragstart', dragStart);
    inputTextDiv.addEventListener('drop', dropped);
    inputTextDiv.addEventListener('dragenter', cancelDefault);
    inputTextDiv.addEventListener('dragover', cancelDefault);
    allContentDiv.insertBefore(inputTextDiv, insertPosition)
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

allContentDiv.addEventListener("click", (e) => {
    let allButtonCount = document.querySelectorAll("#enter").length
    if((e.target.tagName == "LI")&&(e.target.id=="element")&&(allButtonCount==1)){
        let originalText = e.target.innerText;
        originalFormForm.style.display = "none"
        e.target.replaceWith(modifyText(originalText))
  
    }
});

textareaContent.addEventListener("click", (e) => {
    e.target.style = "font-size:" + getCurrentStyle()
})


function dragStart(e){
    let allItem = document.querySelectorAll('#items-list > li')
    let index = Array.from(allItem).indexOf(e.target)
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
