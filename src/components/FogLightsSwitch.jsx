import React from "react";
import styled, { keyframes, css } from "styled-components";
import ApiFetchComponent from "./ApiFetchComponent";
import {
    parseHexColor,
    createRGBAString,
    getCurrentColors,
    subscribeAsProp,
} from "../appearance";
import fogLightsIcon from "../imgs/foglights.png";
import "./FogLightsSwitch.scss";

const FogLightsAnimation = (outlineColor) => keyframes`
0%,
50% {
    border-color: ${createRGBAString([...parseHexColor(outlineColor), 1])};
}

100% {
    border-color:  ${createRGBAString([...parseHexColor(outlineColor), 0.4])};
}
`;

const FogLightsAnimate = styled.div`
    ${({ animate }) => (animate ? "" : "animation:none !important;")}
    animation-name: ${({ outlineColor }) => FogLightsAnimation(outlineColor)};
    animation-iteration-count: infinite;
    animation-direction: alternate;
`;
class FogLightsSwitch extends ApiFetchComponent {
    render() {
        return (
            <FogLightsAnimate
                className={`centerChildren fogLightsOutline ${
                    this.state.apiState ? "fogLightsSwitched" : ""
                }`}
                onClick={() => this.handleApiRequest("toggle")}
                animate={this.state.apiState !== null}
                outlineColor={
                    getCurrentColors(this.props.appearance).HighlightColor
                }>
                <img
                    src={fogLightsIcon}
                    alt="Fog Lights Icon"
                    className={`unselectable fogLightsSwitch`}
                />
            </FogLightsAnimate>
        );
    }
}

export default subscribeAsProp(FogLightsSwitch);
