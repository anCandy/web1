count = 20;
timerId = null;
onmessage=function(e){
    if("start" === e.data){
        if(timerId != null)
            return;
        timerId = setInterval(myCallback, 1000);
    }
    else if("stop" === e.data){
        if(timerId === null)
            return;
        clearInterval(timerId);
        close();
    }    
}
function myCallback(){
    count--;
    postMessage(count);
}