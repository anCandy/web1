var canvas = null;
var context = null;
var startX = 0, startY = 0;
var dragging=false;
window.onload = init;

function init(){
    var divList = document.getElementsByName("Pcolor");
    for(var i=0;i<divList.length;i++)
        divList[i].addEventListener("click", clickPalette);
    
    canvas = document.getElementById("mycanvas");
    context = canvas.getContext("2d");

    canvas.addEventListener("mousemove", currentCursor);

    canvas.addEventListener("mousedown", function(e){ down(e) });
    canvas.addEventListener("mousemove", function(e){ move(e) });
    canvas.addEventListener("mouseup", function(e){ up(e) });
    canvas.addEventListener("mouseout", function(e){ out(e) });
}
function clickPalette(e){
    document.getElementById("inputColor").style.backgroundColor = e.target.style.backgroundColor;
}
function clickInputColor(e){
    document.getElementById("inputColor").style.backgroundColor = e.target.value;
}
function currentCursor(e){
    document.getElementById("x").innerHTML = "x=" + e.offsetX;
    document.getElementById("y").innerHTML = "y=" + e.offsetY;
}
function draw(curX, curY){
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(curX, curY);
    context.stroke();
}
function down(e){
    startX=e.offsetX; 
    startY=e.offsetY; 
    dragging=true;

    context.lineWidth = document.getElementById("inputLineWidth").value;
    context.strokeStyle = document.getElementById("inputColor").style.backgroundColor;
}
function move(e){
    if(!dragging)
        return;
    draw(e.offsetX, e.offsetY);
    startX=e.offsetX;
    startY=e.offsetY;
}
function up(e){
    dragging=false;
}
function out(e){
    dragging=false;
}
function clear(e){
    alert("눌림");
    context.clearRect(0, 0, canvas.width, canvas.height);
}