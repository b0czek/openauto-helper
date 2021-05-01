import fogLightsIcon from "../imgs/foglights.png";
import React from "react";
import ApiFetchComponent from "./ApiFetchComponent";
class FogLightsSwitch extends ApiFetchComponent {
    render() {
        return (
            <div className="fogLightsOutline">
                <img
                    src={fogLightsIcon}
                    alt="Fog Lights Icon"
                    className={`unselectable fogLightsSwitch ${
                        this.state.apiState ? "fogLightsOutline" : ""
                    }`}
                    onClick={() => this.handleApiRequest("toggle")}
                />
            </div>
        );
    }
}

export default FogLightsSwitch;
