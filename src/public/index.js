


var opts = {
    angle: -0.2, // The span of the gauge arc
    lineWidth: 0.2, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#ffffff', // Fill color
        outlineWidth: 1,
        outlineColor: "#ff0000"
    },
    limitMax: true,     // If false, max value increases automatically if value > maxValue
    limitMin: true,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticZones: [
        { strokeStyle: "#F03E3E", min: 0.00, max: 1 }, // Red
        { strokeStyle: "#FFDD00", min: 0.50, max: 1.5 }, // Yellow
        { strokeStyle: "#30B32D", min: 1.50, max: 4.0 }, // Green
        { strokeStyle: "#FFDD00", min: 3.50, max: 4.5 }, // Yellow
        { strokeStyle: "#F03E3E", min: 4.50, max: 5 }  // Red
    ],
    staticLabels: {
        font: "18px sans-serif",  // Specifies font
        labels: [0.0, .50, 1.50, 3.5, 4.5, 5.0],  // Print labels at these values
        color: "#ffffff",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
};
var target = document.getElementById('gauge'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 5.00; // set max gauge value
gauge.setMinValue(0.00);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 32; // set animation speed (32 is default value)
gauge.set(0); // set actual value


let label = document.getElementById('value');


window.api.receive('oilpressure.0', (err, data) => {
    if (err) {
        label.innerText = "-.--";
        return;
    }
    gauge.set(data); // set actual value
    label.innerText = data.toFixed(2);
});
window.onload = _ => {
    window.api.send('oilpressure.0');
    window.api.send('foglights.0', 'read');
    window.api.send('eco.0', 'read');
};




let stateClassName = "fogLightsSwitched";
let bar = document.getElementById("bottomBarContent");

let outline = document.getElementById("fogLightsOutline");

const switchLights = _ => {
    window.api.send('foglights.0', 'toggle');
};

bar.onclick = switchLights;

window.api.receive('foglights.0', (err, wroteState) => {
    if (err) {
        console.error(err);
    }
    else {
        // if foglights are turned on 
        if (wroteState == 0) {
            outline.classList.add(stateClassName);
        }
        else {
            outline.classList.remove(stateClassName);
        }
    }
});





let ecoStateClassName = "ecoIndicatorInactive";
let icon = document.getElementById("ecoIndicator");

let container = document.getElementById("ecoIndicatorContainer");

const switchEco = _ => {
    window.api.send('eco.0', 'toggle');
};
container.onclick = switchEco;

window.api.receive('eco.0', (err, feedback) => {
    if (err) {
        console.error(err);
    }
    else {
        if (feedback == 0) {
            icon.classList.add(ecoStateClassName);
        }
        else {
            icon.classList.remove(ecoStateClassName);
        }
    }
});















let watch = document.getElementById("watch");
setInterval(() => {
    let now = new Date();
    watch.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}, 1000);