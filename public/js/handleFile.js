function save(){
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
    console.log(JSON.stringify(data))
    let config = {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    console.log(data)
    // fetch("/file/save", config)

}