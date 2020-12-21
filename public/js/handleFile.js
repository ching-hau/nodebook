const save_as = async () => {
    let motherDivData = document.querySelector("#motherDiv").innerHTML;
    let titleTextDiv = document.querySelector("#childTitle");
    if(!titleTextDiv){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `You should enter the file name first.`,
            showConfirmButton: false,
            timer: 1500
        })
        return 
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
        body: JSON.stringify(data).replace(/white|black|102/g, "")
    }
    const result = await fetch("/file/saveas", config).then(res=> {return res.json()})
    if(result.stat === "repeated file name"){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `This file name was used. Please try a new one.`,
            showConfirmButton: false,
            timer: 1500
        })
    }else if(result.stat == "success"){
        localStorage.setItem(result.file_name, JSON.stringify(result));
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `You saved this file as ${title}.`,
            showConfirmButton: true,
            confirmButtonText:"ok"
        }).then((res) =>{
            window.location.replace(`/template.html?id=${result.project_id}`)
            socket.emit("update file")
        })
    }else{
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `This file is not saved.`,
            showConfirmButton: false,
            timer: 2000
        })
    }
    
}

const save = async () => {
    let titleTextDiv = document.querySelector("#childTitle");
    if(!titleTextDiv){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `You should enter the file name first`,
            showConfirmButton: false,
            timer: 1500
        })
        return //alert("You should enter the file name first")
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
        localStorage.setItem(result.file_name, JSON.stringify(result))
        //alert(`${title} was saved.`)
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${title} was saved.`,
            showConfirmButton: false,
            timer: 1500
        }).then(socket.emit("update file"))
    }else{
        //alert("You have never saved this file. Please save this file as the new one.")
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: `You have never saved this file. Please save this file as the new one.`,
            showConfirmButton: false,
            timer: 1500
        })
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
        //alert(`${title} has been deleted.`);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${title} has been deleted.`,
            showConfirmButton: false,
            timer: 1500
        }).then((res) => {
            window.location.replace("/userFile.html");
            socket.emit("update file");
        })
    }
}

const deleteAll = async () => {
    Swal.fire({
        title: 'Do you want to clear trashes?',
        showDenyButton: true,
        confirmButtonText: `Yes, I will never regret.`,
        denyButtonText: `No, I will need them.`,
    }).then((result) => {
        if (result.isConfirmed) {
            let deletedFileID = []
            let data = {
                token: localStorage.getItem("pcToken"),
            }
            let config = {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    "pcToken":localStorage.getItem("pcToken"),
                },
                body: JSON.stringify(data)
            }
            fetch("/file/deleteAll", config)
            .then(result => {return result.json()})
            .then(result => {
                if(result.stat == "success"){
                    Swal.fire('Clear!!!', '', 'success')
                    let allDeletedFieA = document.querySelectorAll(".trashList")
                    allDeletedFieA.forEach(element => {
                        element.remove();
                    })
                }
            })
            .then(socket.emit("update file"))
            //Swal.fire('Clear!!!', '', 'success')
        } 
    })
}

const updateToNormalMode = (data) => {
    data.replace(/black/g, white)
}

