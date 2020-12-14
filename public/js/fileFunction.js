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







// var txtFile = "new.js";
// var file = new File();
// var str = "My string of text";

// file.open("w"); // open file with write access
// file.writeln("First line of text");
// file.writeln("Second line of text " + str);
// file.write(str);
// file.close();