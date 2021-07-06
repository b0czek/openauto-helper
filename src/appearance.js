import React from "react";
import { createContainer } from "unstated-next";

//#region appearance helper functions
// helper functions for working with the appearance
export const parseHexColor = (color) => {
    color = color.slice(1); //drop the #
    let result = [];
    for (let i = 0; i < 6; i += 2) {
        result.push(parseInt(color.slice(i, i + 2), 16));
    }
    return result;
};
export const createRGBString = (colors) => `rgb(${colors.join(",")})`;
export const createRGBAString = (colors) => `rgba(${colors.join(",")})`;
//#endregion appearance helper functions

// get colors depending on if its day/night mode 
export const getCurrentColors = (appearance) => appearance.colors[appearance.daynight ?? "night"];


const AppearanceState = (initialState = window.appearance) => {
    let [appearance, setAppearance] = React.useState(initialState);

    React.useEffect(() => {
        window.api.receive("appearance", (config) => {
            setAppearance(config);
        });
        window.api.send("appearance");

        window.api.receive("daynight", (state) => {
            setAppearance({
                daynight: state
            });
        });
        window.api.send("daynight");

    }, []);
    return appearance;
};

let Appearance = createContainer(AppearanceState);

export default Appearance;