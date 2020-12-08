const save_as = async () => {
    let motherDivData = document.querySelector("#motherDiv").innerHTML;
    let titleTextDiv = document.querySelector("#childTitle");
    if(!titleTextDiv){
        return alert("You should enter the file name first")
    }
    let title = titleTextDiv.innerText;
    let data = {
        token: "test",
        user_email: "test",
        file_name: title,
        file_content: motherDivData
    }
    let config = {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    const result = await fetch("/file/saveas", config).then(res=> {return res.json()})
    localStorage.setItem(result.file_name, JSON.stringify(result));
    console.log(result)
    alert(`You have saved this file as ${title}.`)
    window.location.replace(`/template.html?id=${result.project_id}`);
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
            token: "test",
            project_id: content.project_id,
            user_email: content.user_email,
            file_name: content.file_name,
            file_content: motherDivData
        }
        let config = {
            method:'POST',
            headers:{'Content-Type': 'application/json'},
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