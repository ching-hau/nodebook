const createUserList = async () => {
    let allIDs = await fetch("/file/allProjectsId").then(result => {return result.json()});
    const filesDiv = document.querySelector(".userFiles");
    allIDs.forEach(element => {
        const aElement = document.createElement("a");
        aElement.classList.add("dropdown-item");
        aElement.classList.add("navItem");
        aElement.href = `/template.html?id=${element.id}`
        aElement.target="_blank"
        aElement.innerText = element.file_name
        filesDiv.append(aElement)
    });
}
createUserList();