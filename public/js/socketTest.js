const socket = io()

const messageForm = document.querySelector('form')
const messageInput = document.querySelector('#inputMessage')
const messagesAll = document.querySelector('#messages')

function appendMessage (message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messagesAll.append(messageElement)
}

function getInputSelection (el) {
  let end = 0
  let endRange; let len; let normalizedValue
  let range
  let start = 0
  let textInputRange
  if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
    start = el.selectionStart
    end = el.selectionEnd
  } else {
    range = document.selection.createRange()
    if (range && range.parentElement() == el) {
      len = el.value.length
      normalizedValue = el.value.replace(/\r\n/g, '\n')
      // create a working TextRange that lives only in the input
      textInputRange = el.createTextRange()
      textInputRange.moveToBookmark(range.getBookmark())

      /*
             * check if the start and end of the selection are at the very end
             * of the input, since moveStart/moveEnd doesn't return what we want
             * in those cases
             */
      endRange = el.createTextRange()
      endRange.collapse(false)
      if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
        start = end = len
      } else {
        start = -textInputRange.moveStart('character', -len)
        start += normalizedValue.slice(0, start).split('\n').length - 1
        if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
          end = len
        } else {
          end = -textInputRange.moveEnd('character', -len)
          end += normalizedValue.slice(0, end).split('\n').length - 1
        }
      }
    }
  }

  return {
    start,
    end
  }
}
function offsetToRangeCharacterMove (el, offset) {
  return offset - (el.value.slice(0, offset).split('\r\n').length - 1)
}
function setInputSelection (el, startOffset, endOffset) {
  if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
    el.selectionStart = startOffset
    el.selectionEnd = endOffset
  } else {
    const range = el.createTextRange()
    const startCharMove = offsetToRangeCharacterMove(el, startOffset)
    range.collapse(true)
    if (startOffset == endOffset) {
      range.move('character', startCharMove)
    } else {
      range.moveEnd('character', offsetToRangeCharacterMove(el, endOffset))
      range.moveStart('character', startCharMove)
    }
    range.select()
  }
}

const autoResize = (e) => {
  const height = e.target.scrollHeight
  // e.target.style.height = 'auto';
  if (height > 200) {
    e.target.style.height = `${height}px`
  }
}

const sendKeyPress = (e) => {
  const text = e.target.value
  const position = e.target.selectionStart
  console.log(position)
  socket.emit('enterText', {
    text,
    pos: position
  })
}

socket.on('new', () => {
  console.log('new people get in')
  const newTextArea = document.createElement('textarea')
  newTextArea.addEventListener('keyup', sendKeyPress)
  newTextArea.addEventListener('input', autoResize)
  newTextArea.id = 'hdhdh'
  const motherDiv = document.querySelector('.wrapper')
  motherDiv.append(newTextArea)
})

socket.on('insertText', (msg) => {
  const testTextArea = document.querySelector('textArea')
  console.log(testTextArea.selectionStart, testTextArea.selectionEnd)
  const sel = getInputSelection(testTextArea)
  console.log(msg)
  console.log(sel)
  testTextArea.value = msg.text
  if (sel.start >= msg.pos) {
    console.log('+1')
    const start = sel.start + 1
    const end = sel.end + 1
    console.log(start)
    setInputSelection(testTextArea, start, end)
  } else {
    console.log('+0')
    setInputSelection(testTextArea, sel.start, sel.end)
  }

  // setInputSelection(testTextArea, sel.start, sel.end);
  const height = testTextArea.scrollHeight
  if (height > 200) {
    testTextArea.style.height = `${height}px`
  }
})

const room = 'kk'// prompt("Which room do you want to join?");
socket.emit('new-room', room)
const name = prompt('What is your name?')
socket.emit('new-user', name)

appendMessage(`${name} joined the room- ${room}!`)

socket.on('chat message', (data) => {
  appendMessage(`${data.name}: ${data.message}`)
})
socket.on('user-connected', (name) => {
  appendMessage(`${name} also joined this room!`)
})
socket.on('user-disconnected', (name) => {
  appendMessage(`${name} left the room!`)
})
messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = messageInput.value
  if (message != '') {
    appendMessage(`You: ${message}`)
    console.log(message)
    socket.emit('chat message', message)
    messageInput.value = ''
  }
})

function testSocket () {
  socket.emit('test')
}

socket.on('test2', (data) => {
  appendMessage(data)
})
