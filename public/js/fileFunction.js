const jspdf = window.jspdf;
const canvas = window.html2canvas;

function screenshot() {
    const content = document.querySelector("#motherDiv");
    const title = document.querySelector("#title").innerText;
    if(!title){
        return alert("Please input your title fist.")
    }
    const allButtons = document.querySelectorAll("button");
    if(allButtons){
        allButtons.forEach(element => {
            element.setAttribute("data-html2canvas-ignore", true);
        })
    }
    // let initialposition = 0;
    //let pdfFile = new jspdf.jsPDF('', 'pt', "a4");
    window.scrollTo(0,0);
    canvas(content, {
        allowTaint: true,
        scale: 2,
    }).then((canvas) => {
        console.log(canvas)
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        console.log(contentHeight)
        let pageHeight = (contentWidth / 592) * 840;
        let leftHeight = contentHeight;
        let position = 40;
        const imgWidth = 592;
        let imgHeight = (592 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL('image/png', 1.0);
        let PDF = new jspdf.jsPDF("", "pt", "a4");
        if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'PNG', 60, position, imgWidth, imgHeight);
         } else {
            while (leftHeight > 0) {
               PDF.addImage(pageData, 'PNG', 60, position, imgWidth, imgHeight);
               leftHeight -= pageHeight;
               position -= 840;
               if (leftHeight > 0) {
                  PDF.addPage();
               }
            }
        }
        PDF.save(title+'.pdf');
    })
}



function copyURL(){
    let input = document.querySelector("#pURL");
    input.select();
    document.execCommand("copy");
    alert("copy successfully")
}

async function cancelPublic(){
    let url = "/file/cancelPublic"
    let data = {id:projectID}
    let config = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "pcToken":localStorage.getItem("pcToken"),
        },
        body: JSON.stringify(data)
    }
    let result = await fetch(url, config).then(res => {return res.json()});
    if(result.stat == "success"){
        alert("You have canceled sharing this file to public.")
        window.location.reload();
    }else{
        alert("Something Wrong!")
    }
}

async function shareToPublic(){
    let url = "/file/toPublic"
    let data = {id:projectID}
    let config = {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "pcToken":localStorage.getItem("pcToken"),
        },
        body: JSON.stringify(data)
    }
    let result = await fetch(url, config).then(res => {return res.json()});
    if(result.stat == "success"){
        alert("You have shared this file to public.")
        window.location.reload();
    }else{
        alert("Something Wrong!")
    }
}



// var txtFile = "new.js";
// var file = new File();
// var str = "My string of text";

// file.open("w"); // open file with write access
// file.writeln("First line of text");
// file.writeln("Second line of text " + str);
// file.write(str);
// file.close();