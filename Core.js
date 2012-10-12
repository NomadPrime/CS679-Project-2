//Documentation stuff here
window.onload = function() {
	//RequestAnimationFrame code from flocking demo
	var reqFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */callback, /* DOMElement Element */element) {
            window.setTimeout(callback, 1000 / 60);
        };    
    theCanvas = document.getElementById("mycanvas");
    theContext = theCanvas.getContext("2d");
    
    //world created with 0 gravity, and sleep is disabled
    world = new b2World(new b2Vec2(0,0),false);
    
    
}
