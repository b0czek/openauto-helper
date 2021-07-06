import React from "react";
import styled from "styled-components";

import ApiFetchComponent from "./ApiFetchComponent";
import fogLightsIcon from "../imgs/foglights.png";
import "./FogLightsSwitch.scss";
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
