const urlParams = new URLSearchParams(window.location.search)
const projectID = urlParams.get('id')
const socket = io()

const importSrc = () => new Promise((resolve, reject) => {
  const scriptElement = document.createElement('script')
  const bodyElement = document.querySelector('body')
  scriptElement.src = 'js/emptyFile.js'
  bodyElement.append(scriptElement)
})

const generateFile2 = async (id) => {
  const url = `/file/files?id=${id}`
  const rawData = await fetch(url).then((res) => res.json())
  const motherDiv = document.querySelector('#motherDiv')
  motherDiv.innerHTML = rawData.file_content
  localStorage.setItem(rawData.file_name, JSON.stringify(rawData))
  importSrc()
}

const generateFile = async (id) => {
  const url = `/file/files?id=${id}`
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pcToken: localStorage.getItem('pcToken')
    }
  }
  const rawData = await fetch(url, config).then((res) => res.json())
  if (rawData.stat === 'success') {
    const motherDiv = document.querySelector('#motherDiv')
    motherDiv.innerHTML = rawData.file_content
    localStorage.setItem(rawData.file_name, JSON.stringify(rawData))
    importSrc()
  } else if (rawData.stat === 'invalid') {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'You do not have authority to access to this file.',
      showConfirmButton: false,
      timer: 1500
    })
    // alert("Invalid token to access this file.");
    window.location.replace('/emptyFile.html')
  }
}

const publicCheck = async (projectID) => {
  const url = `/file/filePublicCheck?id=${projectID}`
  const publicInfo = await fetch(url).then((res) => res.json())
  const functionMenu = document.querySelector('.functionMenu')
  if (publicInfo.stat !== 'fail') {
    console.log(publicInfo)
    const aElement = document.createElement('a')
    aElement.classList.add('dropdown-item')
    aElement.classList.add('sharePublic')
    aElement.classList.add('fileFunction')
    aElement.innerText = 'Cancel to share'
    aElement.addEventListener('click', cancelPublic)
    functionMenu.append(aElement)
    const urlDiv = document.createElement('div')
    const urlDivChild = document.createElement('div')
    const urlInput = document.createElement('input')
    const urlBtn = document.createElement('button')
    urlDiv.classList.add('publicRegion')
    urlDivChild.innerHTML = '<strong>Public URL:</strong>'
    urlInput.id = 'pURL'
    urlInput.value = `https://nodebook.club/publicFile.html?publicFile=${publicInfo.endPoints}`
    urlBtn.classList.add('btn')
    urlBtn.classList.add('btn-dark')
    urlBtn.classList.add('copyBtn')
    urlBtn.addEventListener('click', copyURL)
    urlBtn.innerText = 'copy'
    urlDiv.append(urlDivChild)
    urlDiv.append(urlInput)
    urlDiv.append(urlBtn)
    functionMenu.append(urlDiv)
  } else {
    const aElement = document.createElement('a')
    aElement.classList.add('dropdown-item')
    aElement.classList.add('sharePublic')
    aElement.classList.add('fileFunction')
    aElement.innerText = 'Share to Public'
    aElement.addEventListener('click', shareToPublic)
    functionMenu.append(aElement)
  }
}
const updatePageTitle = async () => {
  const currentTitleName = document.querySelector('#title').innerText
  document.querySelector('title').innerText = currentTitleName
}

const summarizePage = async (projectID) => {
  await generateFile(projectID)
  await updatePageTitle()
  await publicCheck(projectID)
}

if (projectID) {
  summarizePage(projectID)
}
