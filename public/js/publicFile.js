const urlParams = new URLSearchParams(window.location.search)
const publicfileId = urlParams.get('publicFile')

const generatePublicFile = async () => {
  const url = `/file/public?publicFile=${publicfileId}`
  const rawData = await fetch(url).then((res) => res.json())
  const motherDiv = document.querySelector('#motherDiv')
  if (rawData.stat === 'success') {
    console.log('here')
    motherDiv.innerHTML = rawData.file_content
    const allForm = document.querySelectorAll('form')
    allForm.forEach((element) => {
      element.remove()
    })
  } else {
    alert('This URL is not available.')
  }
}

const darkSwitchInput = document.querySelector('#darkMode')

const darkSwitch = (e) => {
  console.log(e.target.className.indexOf('off'))
  const totalDiv = document.querySelector('body')
  const allP = document.querySelectorAll('p.newText')
  const childTitleDiv = document.querySelector('#childTitle')
  const textArea = document.querySelectorAll('textarea')
  const sideBar = document.querySelector('.sideBar')
  const topBar = document.querySelector('.topBar')
  const sideBarHeading = document.querySelector('.sidebar-heading')
  const menuBtn = document.querySelector('.menuBtn')
  const allCodingArea = document.querySelectorAll('.coding')
  const sepResult = document.querySelectorAll('#sepResult')
  const home = document.querySelector('.home')
  const sun = document.querySelector('.sun')
  const moon = document.querySelector('.moon')
  if (e.target.className.indexOf('off') === -1) {
    totalDiv.style.backgroundColor = 'black'
    childTitleDiv.style.color = 'white'
    sideBar.classList.remove('bg-light')
    sideBar.classList.add('bg-black')
    topBar.classList.remove('bg-light')
    topBar.classList.add('bg-black')
    menuBtn.classList.remove('btn-light')
    menuBtn.classList.add('btn-black')
    home.classList.remove('bg-light')
    home.classList.add('bg-black')
    home.style.backgroundColor = 'black'
    home.style.color = 'white'
    sideBarHeading.style.color = 'white'
    menuBtn.style.color = 'white'
    allP.forEach((element) => {
      element.style.color = 'white'
    })
    textArea.forEach((element) => {
      element.style.color = 'white'
    })
    allCodingArea.forEach((element) => {
      element.style.backgroundColor = '#666666'
    })
    sepResult.forEach((element) => {
      element.style.color = 'white'
      element.style.borderColor = 'white'
    })
    sun.style.display = 'none'
    moon.style.display = 'block'
  } else {
    totalDiv.style.backgroundColor = 'white'
    childTitleDiv.style.color = 'black'
    sideBar.classList.remove('bg-black')
    sideBar.classList.add('bg-light')
    topBar.classList.remove('bg-black')
    topBar.classList.add('bg-light')
    menuBtn.classList.remove('btn-black')
    menuBtn.classList.add('btn-light')
    home.classList.remove('bg-black')
    home.classList.add('bg-light')
    home.style.backgroundColor = 'white'
    home.style.color = 'black'
    menuBtn.style.color = 'black'
    sideBarHeading.style.color = 'black'
    allP.forEach((element) => {
      element.style.color = 'black'
    })
    textArea.forEach((element) => {
      element.style.color = 'black'
    })
    allCodingArea.forEach((element) => {
      element.style.backgroundColor = '#D3D3D3'
    })
    sepResult.forEach((element) => {
      element.style.color = 'black'
      element.style.borderColor = 'black'
    })
    sun.style.display = 'block'
    moon.style.display = 'none'
  }
}

const updatePageTitle = async () => {
  const currentTitleName = document.querySelector('#title').innerText
  document.querySelector('title').innerText = currentTitleName
}

const generatePublicPage = async (projectID) => {
  await generatePublicFile(projectID)
  await updatePageTitle()
}

darkSwitchInput.parentNode.addEventListener('click', darkSwitch)

if (publicfileId) {
  generatePublicPage(publicfileId)
}
