
const save_as = async () => {
    let motherDivData = document.querySelector("#motherDiv").innerHTML;
    let titleTextDiv = document.querySelector("#childTitle");
    if(!titleTextDiv){
        return alert("You should enter the file name first")
    }
    let title = titleTextDiv.innerText;
    let data = {
        file_name: title,
        file_content: motherDivData
    }
    let config = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "pcToken":localStorage.getItem("pcToken"),
        },
        body: JSON.stringify(data)
    }
    const result = await fetch("/file/saveas", config).then(res=> {return res.json()})
    if(result.stat === "repeated file name"){
        alert("This file name was used. Please try a new one.")
    }else if(result.stat == "success"){
        localStorage.setItem(result.file_name, JSON.stringify(result));
        console.log(result)
        alert(`You saved this file as ${title}.`)
        window.location.replace(`/template.html?id=${result.project_id}`);
    }else{
        alert("This file is not saved.")
    }
}

const save = async () => {
    let titleTextDiv = document.querySelector("#childTitle");
    if(!titleTextDiv){
        return alert("You should enter the file name first")
    }
    let title = titleTextDiv.innerText;
    let content = JSON.parse(localStorage.getItem(title));
    let motherDivData = document.querySelector("#motherDiv").innerHTML;
    if(content){
        let data = {
            token: localStorage.getItem("pcToken"),
            project_id: content.project_id,
            file_name: content.file_name,
            file_content: motherDivData
        }
        let config = {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                "pcToken":localStorage.getItem("pcToken"),
            },
            body: JSON.stringify(data)
        }
        const result = await fetch("/file/save", config).then(res=> {return res.json()});
        console.log(result);
        localStorage.setItem(result.file_name, JSON.stringify(result))
        alert(`${title} was saved.`)
    }else{
        alert("You have never saved this file. Please save this file as the new one.")
    }
}

const deleteFile = async () => {
    const title = document.querySelector("#title").innerText;
    let data = {
        projectID: projectID
    }
    let config = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "pcToken":localStorage.getItem("pcToken"),
        },
        body: JSON.stringify(data)
    }
    const deleteResult = await fetch("/file/delete", config).then(res => {return res.json()});
    if(deleteResult.stat === "success"){
        alert(`${title} has been deleted.`);
        window.location.replace("/userFile.html");
    }
}

