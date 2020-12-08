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

const generateFile = async (id) => {
    let url = "/file/files?id=" + id;
    let rawData = await fetch(url).then(res => {return res.json()})
    const motherDiv = document.querySelector("#motherDiv")
    motherDiv.innerHTML = rawData.file_content;
    localStorage.setItem(rawData.file_name, JSON.stringify(rawData))
    importSrc()
}

if(projectID){
    generateFile(projectID)
}else{
    window.location.replace("/emptyFile.html");
}



