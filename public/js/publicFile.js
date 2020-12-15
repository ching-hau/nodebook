const urlParams = new URLSearchParams(window.location.search);
const publicfileId = urlParams.get('publicFile');

const generatePublicFile = async () => {
    let url = "/file/public?publicFile=" + publicfileId;
    let rawData = await fetch(url).then(res => {return res.json()});
    const motherDiv = document.querySelector("#motherDiv");
    console.log(rawData)
    console.log(rawData.file_content)
    if(rawData.stat == "success"){
        console.log("here")
        motherDiv.innerHTML = rawData.file_content;
        let allForm = document.querySelectorAll("form");
        allForm.forEach(element => {
            element.remove()
        })
    }else{
        alert("This URL is not available.")
    }
}
if(publicfileId){
    generatePublicFile()
}
