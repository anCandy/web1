var count = 8;
var tryNum=8, failNum=0;
var answer_IdxList;
var startButton;
var answerImg;
var boardImg;
var imgArray=null;
var selectable = false;
var audio_obj=null;
var worker=null;
window.onload = init;

function init(){    
    answer_IdxList = new Array();
    answerImg = new Image(70,70);
    boardImg = new Image(70,70);
    answerImg.src="./media/earth-removebg-preview.png"
    boardImg.src="./media/moon-removebg-preview.png";
    startButton = document.getElementById("start");
    imgArray = document.getElementsByName("boardImg");
    audio_obj={
        bgmAudio : document.getElementById("BGM"),
        sound_effect : document.getElementById("sound_effect"),
        count_down : document.getElementById("count_down")
    };
    audio_obj.bgmAudio.play();
    initImage();
    for(var i=0;i<imgArray.length;i++)
        imgArray[i].addEventListener("click", chcek_answer);
    
    retrieve("last");           
}
function start(e){
    workerStop();
    tryNum=8, failNum=0;
    document.getElementById("tryNum").innerHTML = "남은수 : " + tryNum;
    document.getElementById("failNum").innerHTML = "실패수 : " + failNum;
    document.getElementById("success").style.visibility="hidden";
    document.getElementById("fail").style.visibility="hidden";
    startButton.style.visibility="hidden";   
    worker = new Worker("timer.js");
    worker.postMessage("start");
    worker.onmessage = timerWorker;
    
    /* document.getElementById("board").style.backgroundImage="url('')";  */
    document.getElementById("status").innerHTML = "숨은 그림을 보세요";
    initImage();      
    randAnswer();
    retrieve("last");
    audio_obj.bgmAudio.play();
    audio_obj.bgmAudio.volume=0.6;
    audio_obj.bgmAudio.onended=function(e){e.target.play();};
    audio_obj.sound_effect.src="./media/오케스트라 연주.MP3"
    audio_obj.sound_effect.play();

    for(var i=0;i<answer_IdxList.length;i++)
        imgArray[answer_IdxList[i]].src = answerImg.src; 
    
}
function end(result){
    selectable=false;
    startButton.style.visibility="visible";  
    if(result === "success"){
        /* document.getElementById("board").style.backgroundImage="url('./media/Great.png')";
        document.getElementById("board").style.backgroundPosition="bottom";
        document.getElementById("board").style.backgroundRepeat="no-repeat"; */
        document.getElementById("success").style.visibility="visible";
        audio_obj.sound_effect.src="./media/게임클리어5.MP3";            
        audio_obj.sound_effect.play();
        document.getElementById("status").innerHTML = "성공!";
        setTimeout(record_last, 1000);
    }
    else if(result === "fail"){
        /* document.getElementById("board").style.backgroundImage="url('./media/gameover.png')";
        document.getElementById("board").style.backgroundPosition="bottom";
        document.getElementById("board").style.backgroundRepeat="no-repeat"; */
        document.getElementById("fail").style.visibility="visible";
        audio_obj.sound_effect.src="./media/fail.MP3";     
        audio_obj.sound_effect.play();
        document.getElementById("status").innerHTML = "실패";
    }
    show_remains();
}
function randAnswer(){
    answer_IdxList.length=0;
    while(count > answer_IdxList.length){
        var num=0;
        var randNum = Math.floor(Math.random()*24);
        
        if(checker(randNum))
            answer_IdxList.push(randNum);
    }
}
function checker(randNum){
    for(var i=0;i<answer_IdxList.length;i++){
        if(answer_IdxList[i] == randNum)
            return false;
    }
    return true;
}
function initImage(){
    for(var i=0;i<imgArray.length;i++){
        imgArray[i].src="boardImg.src";
        imgArray[i].style.border="";
    }
}
function show_remains(){
    for(var i=0; i<answer_IdxList.length; i++){
        if(imgArray[answer_IdxList[i]].src != answerImg.src){
            imgArray[answer_IdxList[i]].src = answerImg.src
            imgArray[answer_IdxList[i]].style.border="1px solid red";
        }
    }
}
function win_chercker(){
    for(var i=0; i<answer_IdxList.length; i++)
        if(imgArray[answer_IdxList[i]].src != answerImg.src)
            return false;
    
    return true;
}
function timerWorker(e){
    var data = parseInt(e.data);
    if(data === 15){
        audio_obj.sound_effect.src="./media/시계소리1.mp3";            
        audio_obj.sound_effect.play();
        audio_obj.bgmAudio.volume=0.4;
    }else if(data === 10){
        audio_obj.sound_effect.pause();
        initImage();
        audio_obj.bgmAudio.volume=0.6;
        selectable=true;
        document.getElementById("status").innerHTML = "정답을 찾으세요";
    }
    else if(data === 0){
        workerStop();
        end("fail");
    }
    
    document.getElementById("timer").innerHTML = "남은 시간 : " + e.data;
}
function workerStop(){
    if(worker!=null){
        worker.postMessage("stop");
        worker=null;
        return;
    }
    else
        return;
}
function isRight(e){
    for(var i=0;i<count;i++){
        if(e.target == imgArray[answer_IdxList[i]]){
            e.target.src = answerImg.src;
            audio_obj.sound_effect.src="./media/맞추었어.MP3"; 
            return true;  
        }
    } 
    return false;
}
function chcek_answer(e){
    if(!selectable)
        return;   

    audio_obj.sound_effect.src="./media/띠-으-으.MP3";
    document.getElementById("tryNum").innerHTML = "남은수 : " + --tryNum;
    if(!isRight(e))
        failNum++;  
    audio_obj.sound_effect.play();    
    document.getElementById("failNum").innerHTML = "실패수 : " + failNum;

    if(win_chercker()){
        workerStop();
        end("success");
        return;
    }
    if(failNum>4 || tryNum < 1){
        workerStop();
        end("fail");
        return;
    }  
}
function store(val){
    if(!window.localStorage){
        alert("로컬스토리지를 지원하지 않습니다.");
        return;
    }    
    window.localStorage.setItem("last", val);
}
function retrieve(key){
    if(!window.localStorage){
        alert("로컬스토리지를 지원하지 않습니다.");
        return;
    }
    var  val = window.localStorage.getItem(key);
    if(val == null)
        document.getElementById("last").innerHTML = "도전하세요!";
    else
        document.getElementById("last").innerHTML = window.localStorage.getItem(key);    
}
function record_last(){
    var ret = prompt("축하합니다. 이름을 남겨주세요!","");
        if(ret){
            store(ret); 
            retrieve("last");  
        }
}
