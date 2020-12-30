const createUserListN = async () => {
  const allIDs = await fetch('/file/allProjectsId').then((result) => result.json())
  const filesDiv = document.querySelector('.userFiles')
  allIDs.forEach((element) => {
    const aElement = document.createElement('a')
    aElement.classList.add('dropdown-item')
    aElement.classList.add('navItem')
    aElement.href = `/template.html?id=${element.id}`
    aElement.target = '_blank'
    aElement.innerText = element.file_name
    filesDiv.append(aElement)
  })
}

const verifyUser = async () => {
  const userToken = localStorage.getItem('pcToken')
  if (userToken) {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pcToken: userToken
      }
    }
    const allIDs = await fetch('/file/user', config).then((result) => result.json())
    if (allIDs.stat == 'fail token') {
      // alert("Please sign in again.");
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please sign in again.',
        showConfirmButton: false,
        timer: 1500
      })
      localStorage.removeItem('pcToken')
      window.location.replace('/')
    }
    const filesDiv = document.querySelector('.userFiles')
    const trashDiv = document.querySelector('.userTrashes')
    allIDs.forEach((element) => {
      const aElement = document.createElement('a')
      aElement.classList.add('dropdown-item')
      aElement.classList.add('navItem')
      aElement.classList.add('trashList')
      aElement.target = '_blank'
      aElement.innerText = element.file_name
      if (element.file_delete === '0') {
        aElement.href = `/template.html?id=${element.id}`
        filesDiv.append(aElement)
      } else if (element.file_delete === '1') {
        aElement.href = `/deleteFile.html?id=${element.id}`
        trashDiv.append(aElement)
      }
    })
  } else {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Please sign in first.',
      showConfirmButton: false,
      timer: 1500
    })
    localStorage.removeItem('pcToken')
    window.location.replace('/')
  }
}

verifyUser()
