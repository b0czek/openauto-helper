import React from "react";
import styled from "styled-components";

import TopBar from "./TopBar";
import Content from "./Content";
import BottomBar from "./BottomBar";
import Appearance, {
    createRGBString,
    parseHexColor,
    getCurrentColors,
} from "../appearance";

import "./App.scss";

// #region appbackground

const createGradientTarget = (colors) =>
    colors.map((color) => color / (4 + (0.25 * color) / 255));

const createBackgroundGradient = (color) => {
    let backgroundColor = parseHexColor(color);
    let targetGradientColors = createGradientTarget(backgroundColor);
    return `linear-gradient(
        0deg,
        ${createRGBString(targetGradientColors)} 0%,
        ${createRGBString(backgroundColor)} 50%,
        ${createRGBString(targetGradientColors)} 100%)`;
};

const Background = styled.div`
    background: ${({ color }) => createBackgroundGradient(color)};
`;

// #endregion appbackground

const App = () => {
    let appearance = Appearance.useContainer();
    return (
        <Background
            className="container"
            color={getCurrentColors(appearance).BackgroundColor}>
            <TopBar />
            <Content />
            <BottomBar />
        </Background>
    );
};

export default App;
