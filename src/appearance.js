import React from "react";
import { createContainer } from "unstated-next";

const AppearanceState = (initialState = window.appearance) => {
    let [appearance, setAppearance] = React.useState(initialState);
    React.useEffect(() => {
        window.api.receive("appearance", (config) => {
            setAppearance(config);
        });
        window.api.send("appearance");
    }, []);
    return appearance;
};

let Appearance = createContainer(AppearanceState);
export default Appearance;