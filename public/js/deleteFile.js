const urlParams = new URLSearchParams(window.location.search);
const projectID = urlParams.get('id');

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
    if(rawData.stat === "success" && rawData.file_delete === "1"){
        const motherDiv = document.querySelector("#motherDiv")
        console.log(rawData)
        motherDiv.innerHTML = rawData.file_content;
        localStorage.setItem(rawData.file_name, JSON.stringify(rawData))
        const inputForm = document.querySelector("#inputForm")
        inputForm.remove()
    }else if(rawData.stat === "invalid"){
        alert("Invalid token to access this file.");
        window.location.replace("/emptyFile.html")
    }else if(rawData.file_delete === "0"){
        alert("You can not access to this file.");
        window.location.replace("/emptyFile.html");
    }
}

const recover = async () => {
    let data = {projectID:projectID}
    let config = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "pcToken":localStorage.getItem("pcToken"),
        },
        body: JSON.stringify(data)
    }
    let recoverResult = await fetch("/file/recover", config).then(res => {return res.json()})
    if(recoverResult.stat == "success"){
        alert("You have recovered this file.")
        window.location.replace("/template.html?id="+projectID)
    }else{
        alert("Something Wrong.")
    }
}

const deleteForever = async () => {
    let word = prompt(`Please enter " bye-bye " to delete this file.`)
    if(word == "bye-bye"){
        const title = document.querySelector("#title").innerText;
        console.log(title)
        let data = {projectID:projectID}
        let config = {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                "pcToken":localStorage.getItem("pcToken"),
            },
            body: JSON.stringify(data)
        }
        let deleteForeverResult = await fetch("/file/deleteForever", config).then(res => {return res.json()});
        if(deleteForeverResult.stat == "success"){
            alert(`${title} has beened deleted forever.`);
            window.location.replace("/emptyFile.html");
        }else{
            alert(`Something wrong.`)
        }
    }else{
        alert("You did not delete it.")
    }



}


if(projectID){
    generateFile(projectID)
}
