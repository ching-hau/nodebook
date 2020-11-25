const originalFormForm = document.querySelector("#originalForm");
const newFormForm = document.querySelector("#newForm");
const allContentDiv = document.querySelector(".allContent");
const textareaContent = document.querySelector("textarea");

function appendText(text, insertPosition){
    const inputTextDiv = document.createElement("div");
    inputTextDiv.innerText = text;
    inputTextDiv.id = `element`;
    inputTextDiv.classList.add("newText");
    inputTextDiv.style = "font-size:" + getCurrentStatus();
    console.log(getCurrentStatus())
    allContentDiv.insertBefore(inputTextDiv, insertPosition)
}
function getCurrentStatus(){
    const currentStatus = document.querySelector("#catagory").value;
    let fontSize;
    switch(currentStatus){
        case "title":
            fontSize = "150%;font-weight:bold;"
            break;
        case "subTitle":
            fontSize = "120%"
            break;
        case "text":
            fontSize = "80%"
            break;
        default:
            fontSize = "50%;background-color: #D3D3D3;"
            break;
    }
    return fontSize;
}

function modifyText(originalText){
    const newForm = document.createElement("form");
    const newTextArea = document.createElement("textarea");
    const newFormButton = document.createElement("button");
    newForm.id = "newForm";
    newTextArea.rows = "10";
    newTextArea.cols = "30";
    newTextArea.style = "font-size:" + getCurrentStatus()
    newTextArea.innerText = originalText;
    newFormButton.innerText = "submit";
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
    if((e.target.tagName == "DIV")&&(e.target.id=="element")){
        console.log(e.target.id)
        let originalText = e.target.innerText;
        originalFormForm.style.display = "none"
        e.target.replaceWith(modifyText(originalText))
  
    }
});

textareaContent.addEventListener("click", (e) => {
    console.log(e.target)
    e.target.style = "font-size:" + getCurrentStatus()
})



