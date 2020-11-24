let pcToken = window.localStorage.getItem('pcToken');

function checkUserStatus(pcToken){
    if(!pcToken){
        window.location.replace("index.html")
    }else{
        personDiv = document.querySelector("#person");
        personDiv.innerText = "Welcome!!"
    }
}


checkUserStatus(pcToken)