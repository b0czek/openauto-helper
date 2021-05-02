import React, { createRef } from "react";
import { ContentTile } from "./ContentTiles";
import ApiFetchComponent from "./ApiFetchComponent";
import { Gauge } from "gauge-js-outlined/dist/gauge";
import "./OilPressureGauge.scss";
class OilPressureGauge extends ApiFetchComponent {
    constructor(props) {
        super(props);
        this.canvas = createRef();
    }

    componentDidMount() {
        this.initializeApi();
        this.gauge = new Gauge(this.canvas.current).setOptions({
            angle: -0.2, // The span of the gauge arc
            lineWidth: 0.2, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
                length: 0.6, // // Relative to gauge radius
                strokeWidth: 0.035, // The thickness
                color: "#ffffff", // Fill color
                outlineWidth: 2,
                outlineColor: "#ff0000",
            },
            limitMax: true, // If false, max value increases automatically if value > maxValue
            limitMin: true, // If true, the min value of the gauge will be fixed
            colorStart: "#6FADCF", // Colors
            colorStop: "#8FC0DA", // just experiment with them
            strokeColor: "#E0E0E0", // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true, // High resolution support
            staticZones: [
                { strokeStyle: "#F03E3E", min: 0.0, max: 1 }, // Red
                { strokeStyle: "#FFDD00", min: 0.5, max: 1.5 }, // Yellow
                { strokeStyle: "#30B32D", min: 1.5, max: 4.0 }, // Green
                { strokeStyle: "#FFDD00", min: 3.5, max: 4.5 }, // Yellow
                { strokeStyle: "#F03E3E", min: 4.5, max: 5 }, // Red
            ],
            staticLabels: {
                font: "18px sans-serif", // Specifies font
                labels: [0.0, 0.5, 1.5, 3.5, 4.5, 5.0], // Print labels at these values
                color: "#ffffff", // Optional: Label text color
                fractionDigits: 0, // Optional: Numerical precision. 0=round off.
            },
        });
        this.gauge.maxValue = 5.0; // set max gauge value
        this.gauge.setMinValue(0.0); // Prefer setter over gauge.minValue = 0
        this.gauge.animationSpeed = 32; // set animation speed (32 is default value)
        this.gauge.set(0); // set actual value
    }

    componentDidUpdate = () => {
        this.gauge.set(this.state.apiState);
    };

    render() {
        return (
            <ContentTile>
                <canvas ref={this.canvas} className="oilPressureGauge"></canvas>
                <div className="oilPressureValue">
                    {this.state.apiState ?? "-.--"}
                </div>
            </ContentTile>
        );
    }
}
export default OilPressureGauge;
