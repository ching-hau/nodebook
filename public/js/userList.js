const createUserList = async () => {
    let allIDs = await fetch("/file/allProjectsId").then(result => {return result.json()});
    const filesDiv = document.querySelector(".userFiles");
    allIDs.forEach(element => {
        const aElement = document.createElement("a");
        aElement.classList.add("dropdown-item");
        aElement.classList.add("navItem");
        aElement.href = `/template.html?id=${element.id}`
        aElement.target="_blank"
        aElement.innerText = element.file_name
        filesDiv.append(aElement)
    });
}



const veryUser = async () => {
    let userToken = localStorage.getItem("pcToken");
    if(userToken){
        let config = {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                "pcToken":userToken,
            }
        }
        let allIDs = await fetch("/file/user", config).then(result => {return result.json()});
        if( allIDs.stat == "fail token"){
            alert("Please sign in again.");
            window.location.replace("/");
        }
        const filesDiv = document.querySelector(".userFiles");
        allIDs.forEach(element => {
            const aElement = document.createElement("a");
            aElement.classList.add("dropdown-item");
            aElement.classList.add("navItem");
            aElement.href = `/template.html?id=${element.id}`
            aElement.target="_blank"
            aElement.innerText = element.file_name
            filesDiv.append(aElement)
        });
    }else{
        alert("Please Sign in first");
        window.location.replace("/")
    }
}

veryUser()