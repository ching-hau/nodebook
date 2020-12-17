const jspdf = window.jspdf;
const canvas = window.html2canvas;

function screenshot() {
    const content = document.querySelector("#motherDiv");
    const title = document.querySelector("#title").innerText;
    if(!title){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `You should enter the file name first.`,
            showConfirmButton: false,
            timer: 1500
        })
        return;
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
    //alert("copy successfully");
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: `copy successfully`,
        showConfirmButton: false,
        timer: 1500
    })

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
        //alert("You have canceled sharing this file to public.");
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `You have canceled sharing this file to public.`,
            showConfirmButton: false,
            timer: 1500
        })

        window.location.reload();
    }else{
        //alert("Something Wrong!")
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `Something Wrong`,
            showConfirmButton: false,
            timer: 1500
        })
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
        //alert("You have shared this file to public.");
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `You have shared this file to public.`,
            showConfirmButton: false,
            timer: 1500
        })
        window.location.reload();
    }else{
        //alert("Something Wrong!");
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `Something Wrong`,
            showConfirmButton: false,
            timer: 1500
        })
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