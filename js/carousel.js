// Variables initialization
var radius = screen.width < 768 ? 145 : 390;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = screen.width < 768 ? 120 : 324;
var imgHeight = screen.width < 768 ? 170 : 459;

// Select DOM carousel elements
var odrag = document.querySelector('#drag-container');
var ospin = document.querySelector('#spin-container');
var aImg = ospin.getElementsByTagName('img');
var aEle = [...aImg];

// Set image width and height
ospin.style.width = imgWidth + 'px';
ospin.style.height = imgHeight + 'px';

var ground = document.querySelector('#ground');
ground.style.width = radius * 3 + 'px';
ground.style.height = radius * 3 + 'px';

// Setup initial delay time for image appearance
function init(delayTime) {
    for (var i = 0; i < aEle.length; i++) {
        aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        aEle[i].style.transition = 'transform 1s';
        aEle[i].style.transitionDelay = (delayTime || (aEle.length - i) / 4) + 's';
    }
}

// Set up object transform
function applyTransform(obj) {
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

// Play object spinning effect
function playSpin(yes = true) {
    ospin.style.animationPlayState = yes ? 'running' : 'paused';
}

// Variables for dragging
var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 0;

// Enable auto-rotating effect
if (autoRotate) {
    var animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert';
    ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Enable on pointer down effect
odrag.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    sX = e.clientX;
    sY = e.clientY;

    // Pointer move effect
    this.onpointermove = function (e) {
        nX = e.clientX;
        nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTransform(odrag);
        sX = nX;
        sY = nY;
    };

    // Pointer up effect
    this.onpointerup = function () {
        odrag.timer = setInterval(() => {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTransform(odrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 17);
        this.onpointermove = this.onpointerup = null;
    };
    return false;
};

// Call the init function with a delay time if needed
init(0);

// Enable mouse wheel effect
odrag.onwheel = function (e) {
    e.preventDefault(); // Prevent default scrolling behavior
    var d = e.deltaY / 20; // Use deltaY for modern browsers
    radius += d; // Update radius
    init(1); // Reinitialize with a delay
};