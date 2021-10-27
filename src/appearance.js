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

const buildAppearance = (config) => {
    return {
        colors: {
            day: config.Day,
            night: config.Night,

        },
        opacity: parseInt(config.Appearance.ControlsOpacity) / 100

    }
}

const AppearanceState = (initialState = window.appearance) => {
    let [appearance, setAppearance] = React.useReducer(
        (state, newValue) => ({ ...state, ...newValue }),
        buildAppearance(initialState));

    React.useEffect(() => {
        window.api.receive("appearance", (err, config) => {
            if (!err) {
                setAppearance(
                    buildAppearance(config)
                );

            }
        });
        window.api.send("appearance", "read");

        window.api.receive("daynight", (err, state) => {
            if (err) return;
            setAppearance({
                daynight: state
            });
        });
        window.api.send("daynight");

    }, []);
    return appearance;
};

let Appearance = createContainer(AppearanceState);

// for class components
export const subscribeAsProp = (ClassComponent) =>
    (props) => {
        let container = Appearance.useContainer();
        return (
            <ClassComponent
                {...props}
                appearance={container}
            />
        );
    }


export default Appearance;