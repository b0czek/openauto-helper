import fogLightsIcon from "../imgs/foglights.png";
import "./FogLightsSwitch.scss";
import React from "react";
import ApiFetchComponent from "./ApiFetchComponent";
class FogLightsSwitch extends ApiFetchComponent {
    render() {
        return (
            <div
                className={`centerChildren fogLightsOutline ${
                    this.state.apiState ? "fogLightsSwitched" : ""
                }`}
                onClick={() => this.handleApiRequest("toggle")}>
                <img
                    src={fogLightsIcon}
                    alt="Fog Lights Icon"
                    className={`unselectable fogLightsSwitch`}
                />
            </div>
        );
    }
}

export default FogLightsSwitch;
