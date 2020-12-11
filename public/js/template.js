const urlParams = new URLSearchParams(window.location.search);
const projectID = urlParams.get('id');

const importSrc = () => {
    return new Promise((resolve, reject) => {
        let scriptElement = document.createElement("script")
        let bodyElement = document.querySelector("body")
        scriptElement.src = "js/emptyFile.js";
        bodyElement.append(scriptElement);
    })
}

const generateFile2 = async (id) => {
    let url = "/file/files?id=" + id;
    let rawData = await fetch(url).then(res => {return res.json()})
    const motherDiv = document.querySelector("#motherDiv")
    motherDiv.innerHTML = rawData.file_content;
    localStorage.setItem(rawData.file_name, JSON.stringify(rawData))
    importSrc()
}


const generateFile = async (id) => {
    let url = "/file/files?id=" + id;
    let config = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "pcToken":localStorage.getItem("pcToken"),
        }
    }
    let rawData = await fetch(url, config).then(res => {return res.json()})
    if(rawData.stat === "success"){
        const motherDiv = document.querySelector("#motherDiv")
        motherDiv.innerHTML = rawData.file_content;
        localStorage.setItem(rawData.file_name, JSON.stringify(rawData))
        importSrc()
    }else if(rawData.stat === "invalid"){
        alert("Invalid token to access this file.");
        window.location.replace("/emptyFile.html")
    }
}


if(projectID){
    generateFile(projectID)
}
