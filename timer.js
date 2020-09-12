var timerId = null;
var count = 0;
onmessage = function(e){
    if(e.data == "start"){
        if(timerId != null)
            return;
        else
            timerId=setInterval(change, 1000);
    }
    else if(e.data == "stop"){
        if(timerId == null)
            return;
        else{
            clearInterval(timerId);
            close();
        }
    }
}

function change(){
    count++;
    postMessage(count);
}