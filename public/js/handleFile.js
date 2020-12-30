const save_as = async () => {
  const motherDivData = document.querySelector('#motherDiv').innerHTML
  const titleTextDiv = document.querySelector('#childTitle')
  if (!titleTextDiv) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'You should enter the file name first.',
      showConfirmButton: false,
      timer: 1500
    })
    return
  }
  const title = titleTextDiv.innerText
  const data = {
    file_name: title,
    file_content: motherDivData
  }
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pcToken: localStorage.getItem('pcToken')
    },
    body: JSON.stringify(data).replace(/white|black/g, '')
      .replace(/102/g, '211')
  }
  const result = await fetch('/file/saveas', config).then((res) => res.json())
  console.log(result)
  if (result.stat === 'repeated file name') {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'This file name was used. Please try a new one.',
      showConfirmButton: false,
      timer: 1500
    })
  } else if (result.stat === 'success') {
    localStorage.setItem(result.file_name, JSON.stringify(result))
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `You saved this file as ${title}.`,
      showConfirmButton: true,
      confirmButtonText: 'ok'
    }).then((res) => {
      window.location.replace(`/template.html?id=${result.project_id}`)
      socket.emit('update file')
    })
  } else {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Please sign in again.',
      showConfirmButton: false,
      timer: 2000
    })
      .then((res) => {
        localStorage.removeItem('pcToken')
        //window.location.replace('/')
      })
  }
}

const save = async () => {
  const titleTextDiv = document.querySelector('#childTitle')
  if (!titleTextDiv) {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'You should enter the file name first',
      showConfirmButton: false,
      timer: 1500
    })

    return // alert("You should enter the file name first")
  }
  const title = titleTextDiv.innerText
  const content = JSON.parse(localStorage.getItem(title))
  const motherDivData = document.querySelector('#motherDiv').innerHTML
  if (content) {
    const data = {
      token: localStorage.getItem('pcToken'),
      project_id: content.project_id,
      file_name: content.file_name,
      file_content: motherDivData
    }
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        pcToken: localStorage.getItem('pcToken')
      },
      body: JSON.stringify(data).replace(/white|black/g, '')
        .replace(/102/g, '211')
    }
    const result = await fetch('/file/save', config).then((res) => res.json())
    localStorage.setItem(result.file_name, JSON.stringify(result))
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `${title} was saved.`,
      showConfirmButton: false,
      timer: 1500
    }).then(socket.emit('update file'))
  } else {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'You have never saved this file. Please save this file as the new one.',
      showConfirmButton: false,
      timer: 1500
    })
  }
}

const deleteFile = async () => {
  const title = document.querySelector('#title').innerText
  const data = {
    projectID
  }
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      pcToken: localStorage.getItem('pcToken')
    },
    body: JSON.stringify(data)
  }
  const deleteResult = await fetch('/file/delete', config).then((res) => res.json())
  if (deleteResult.stat === 'success') {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: `${title} has been deleted.`,
      showConfirmButton: false,
      timer: 1500
    }).then((res) => {
      window.location.replace('/userFile.html')
      socket.emit('update file')
    })
  }
}

const deleteAll = async () => {
  Swal.fire({
    title: 'Do you want to clear trashes?',
    showDenyButton: true,
    confirmButtonText: 'Yes, I will never regret.',
    denyButtonText: 'No, I will need them.'
  }).then((result) => {
    if (result.isConfirmed) {
      const deletedFileID = []
      const data = {
        token: localStorage.getItem('pcToken')
      }
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pcToken: localStorage.getItem('pcToken')
        },
        body: JSON.stringify(data)
      }
      fetch('/file/deleteAll', config)
        .then((result) => result.json())
        .then((result) => {
          if (result.stat === 'success') {
            Swal.fire('Clear!!!', '', 'success')
            const allDeletedFieA = document.querySelectorAll('.trashList')
            allDeletedFieA.forEach((element) => {
              element.remove()
            })
          }
        })
        .then(socket.emit('update file'))
    }
  })
}

const updateToNormalMode = (data) => {
  data.replace(/black/g, white)
}
