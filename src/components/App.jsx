import React from "react";

import { AppearanceStateProvider, AppearanceContext } from "./AppearanceState";

import TopBar from "./TopBar";
import Content from "./Content";
import BottomBar from "./BottomBar";
import "./App.scss";

const parseHexColor = (color) => {
    color = color.slice(1); //drop the #
    let result = [];
    for (let i = 0; i < 6; i += 2) {
        result.push(parseInt(color.slice(i, i + 2), 16));
    }
    return result;
};
const createGradientTarget = (colors) =>
    colors.map((color) => color / (4 + (0.25 * color) / 255));

const createRGBString = (colors) => `rgb(${colors.join(",")})`;

const createBackgroundGradient = (color) => {
    let backgroundColor = parseHexColor(color);
    let targetGradientColors = createGradientTarget(backgroundColor);
    return `linear-gradient(
        0deg,
        ${createRGBString(targetGradientColors)} 0%,
        ${createRGBString(backgroundColor)} 50%,
        ${createRGBString(targetGradientColors)} 100%)`;
};

const App = () => {
    const appearance = React.useContext(AppearanceContext);
    console.log(`???? rerender???`);
    return (
        <AppearanceStateProvider>
            <div
                className="container"
                style={{
                    background: createBackgroundGradient(
                        appearance.night.BackgroundColor
                    ),
                }}>
                <TopBar />
                <Content />
                <BottomBar />
            </div>
        </AppearanceStateProvider>
    );
};

export default App;
