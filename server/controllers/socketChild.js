const cp = require("./childProcessCon");

const socketChild = (socket) => {
    socket.on("send code", async (data) => {
        let {content1, content2, file1, file2, index} = data;
        
        console.log(data)
        let path1 = process.env.PROCESS_PATH +`${file1}.js`;
        let path2 = process.env.PROCESS_PATH +`${file2}.js`;
        await cp.writeFile(content1, path1);
        await cp.writeFile(content2, path2);
        try{
            let promise1 = cp.runChildProcess(path1);
            let promise2 = cp.runChildProcess(path2);
            let allResult = await Promise.all([promise1, promise2]);
            let result;
            if(allResult[1]){
                result = allResult[1].replace(allResult[0],"").toString();
            }else{
                result = allResult[0].toString();
            }
            socket.emit("send reult", {result: result, index: index})

        } catch(err){
            socket.emit("send reult", {result: err, index: index})
        }
        // try{
        //     let result = await cp.runChildProcess(path);
        //     socket.emit("send reult", {result: result, index: index})
        // } catch(err){
        //     socket.emit("send reult", {result: err, index: index})
        // }
    })
}

let path1 = `OtherCode/a.js`;
let path2 = `OtherCode/b.js`;


// const getFinalResult = async ()=> {
//     let promise1 = cp.runChildProcess(path1);
//     let promise2 = cp.runChildProcess(path2);
//     let allResult = await Promise.all([promise1, promise2]);
//     let result;
//     if(allResult[1]){
//         result = allResult[1].replace(allResult[0],"").toString();
//         console.log(allResult)
//     }else{
//         result = allResult[0].toString();
//     }
//     console.log(result)
// }
// //Promise.all([promise1, promise2]).then(result => console.log(result))
// getFinalResult();

module.exports = socketChild;