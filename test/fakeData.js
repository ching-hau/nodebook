const users = [
  {
    name: "Nick",
    email: "nicknick@yahoo.com.tw",
    password: "nicknick",
    login: "native"
  },
  {
    name: "朱璟豪",
    email: "emy33412@gmail.com",
    password: "na",
    login: "google"
  },
  {
    name: "朱璟豪",
    email: "emy33412@yahoo.com.tw",
    password: "na",
    login: "facebook"
  }
]

const user_file = [
  {
    user_email: 'nicknick@yahoo.com.tw',
    file_name: 'test file',
    file_content: '             <div id="title" class=".container w-75">                              <div class="h1" id="childTitle">測試功能</div></div>             <div id="allMovable" class=".container w-75">                 <div draggable="true" class="movable"><p class="newText text-left" style="font-size: 120%;">哈哈哈</p></div><div draggable="true" class="movable"><p class="newText text-left coding" style="font-size: 90%; background-color: rgb(211, 211, 211); padding: 10px;">for(let i = 0; i &lt;10; i ++){console.log(i)}</p><button class="codingBtn btn-outline-dark btn myButton">RUN</button></div><div draggable="true" class="movable"><p class="newText text-left coding" style="font-size: 90%; background-color: rgb(211, 211, 211); padding: 10px;">console.log(1);</p><button class="codingBtn btn-outline-dark btn myButton">RUN</button></div><div draggable="true" class="movable"><p class="newText text-left" style="font-size: 100%;">hahaah</p></div><div draggable="true" class="movable"><p class="newText text-left" style="font-size: 120%;">這樣可以嗎</p></div><form id="inputForm" class="form-group inputForm">                     <textarea rows="1" cols="50" id="inputArea" class="form-control form-control-v2" style="font-size: 120%; height: 40px;"></textarea>                     <button id="enterBtn" class="btn btn-dark enter">ENTER</button>                 </form>             </div>         ',
    file_delete: 1
  },
  {
    user_email: 'nicknick@yahoo.com.tw',
    file_name: 'test file',
    file_content: '             <div id="title" class=".container w-75">                              <div class="h1" id="childTitle">測試功能</div></div>             <div id="allMovable" class=".container w-75">                 <div draggable="true" class="movable"><p class="newText text-left" style="font-size: 120%;">哈哈哈</p></div><div draggable="true" class="movable"><p class="newText text-left coding" style="font-size: 90%; background-color: rgb(211, 211, 211); padding: 10px;">for(let i = 0; i &lt;10; i ++){console.log(i)}</p><button class="codingBtn btn-outline-dark btn myButton">RUN</button></div><div draggable="true" class="movable"><p class="newText text-left coding" style="font-size: 90%; background-color: rgb(211, 211, 211); padding: 10px;">console.log(1);</p><button class="codingBtn btn-outline-dark btn myButton">RUN</button></div><div draggable="true" class="movable"><p class="newText text-left" style="font-size: 100%;">hahaah</p></div><div draggable="true" class="movable"><p class="newText text-left" style="font-size: 120%;">這樣可以嗎</p></div><form id="inputForm" class="form-group inputForm">                     <textarea rows="1" cols="50" id="inputArea" class="form-control form-control-v2" style="font-size: 120%; height: 40px;"></textarea>                     <button id="enterBtn" class="btn btn-dark enter">ENTER</button>                 </form>             </div>         ',
    file_delete: 0
  }
]

module.exports = {
  users,
  user_file
}
