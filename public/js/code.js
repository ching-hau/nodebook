function getCode(){
    let allCodeLi = document.querySelectorAll(".coding")
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

