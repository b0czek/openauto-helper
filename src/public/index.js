let ecoStateClassName = "ecoIndicatorInactive";
let icon = document.getElementById("ecoIndicator");

let container = document.getElementById("ecoIndicatorContainer");

const switchEco = _ => {
    if (icon.classList.contains(ecoStateClassName)) {
        icon.classList.remove(ecoStateClassName);
    }
    else {
        icon.classList.add(ecoStateClassName);
    }
};
container.onclick = switchEco;






let stateClassName = "fogLightsSwitched";
let img = document.getElementById("fogLightsSwitch");
let bar = document.getElementById("bottomBarContent");

let outline = document.getElementById("fogLightsOutline");

const switchLights = _ => {
    if (outline.classList.contains(stateClassName)) {
        outline.classList.remove(stateClassName);
    }
    else {
        outline.classList.add(stateClassName);
    }
};
bar.onclick = switchLights;
// img.onclick = switchLights;








var opts = {
    angle: -0.2, // The span of the gauge arc
    lineWidth: 0.2, // The line thickness
    radiusScale: 1, // Relative radius
    pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#ffffff', // Fill color
        outlineWidth: 0.5,
        outlineColor: "#ff0000"
    },
    limitMax: false,     // If false, max value increases automatically if value > maxValue
    limitMin: false,     // If true, the min value of the gauge will be fixed
    colorStart: '#6FADCF',   // Colors
    colorStop: '#8FC0DA',    // just experiment with them
    strokeColor: '#E0E0E0',  // to see which ones work best for you
    generateGradient: true,
    highDpiSupport: true,     // High resolution support
    staticZones: [
        { strokeStyle: "#F03E3E", min: 0.00, max: 0.50 }, // Red
        { strokeStyle: "#FFDD00", min: 0.50, max: 1.5 }, // Yellow
        { strokeStyle: "#30B32D", min: 1.50, max: 3.5 }, // Green
        { strokeStyle: "#FFDD00", min: 3.50, max: 4.50 }, // Yellow
        { strokeStyle: "#F03E3E", min: 4.50, max: 5.06 }  // Red
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
gauge.maxValue = 5.06; // set max gauge value
gauge.setMinValue(0.00);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 32; // set animation speed (32 is default value)
gauge.set(0); // set actual value


let label = document.getElementById('value');


window.api.receive('voltage', (voltage) => {
    gauge.set(voltage); // set actual value
    label.innerText = voltage.toFixed(2);
    //console.log(voltage);
});
window.onload = _ => {
    window.api.send('valuesRequest');
};