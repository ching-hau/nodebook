const createUserListN = async () => {
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

const verifyUser = async () => {
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
        const trashDiv = document.querySelector(".userTrashes")
        allIDs.forEach(element => {
            const aElement = document.createElement("a");
            aElement.classList.add("dropdown-item");
            aElement.classList.add("navItem");
            aElement.target="_blank"
            aElement.innerText = element.file_name
            if(element.file_delete === "0"){
                aElement.href = `/template.html?id=${element.id}`
                filesDiv.append(aElement)
            }else if(element.file_delete === "1"){
                aElement.href = `/deleteFile.html?id=${element.id}`
                trashDiv.append(aElement)
            }
            
        });
    }else{
        alert("Please Sign in first");
        window.location.replace("/")
    }
}

const test = () => {
    console.log(1)
    console.log(2)
}


verifyUser()