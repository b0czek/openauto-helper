import React from "react";

const defaultAppearance = window.appearance;

export const AppearanceContext = React.createContext(defaultAppearance);

export const AppearanceStateProvider = ({ children }) => {
    const [appearanceState, setAppearance] = React.useReducer(
        (state, newValue) => ({ ...state, ...newValue }),
        defaultAppearance
    );
    React.useEffect(() => {
        window.api.receive("appearance", (config) => {
            setAppearance(config);
        });
        window.api.send("appearance");
    }, []);
    return (
        <AppearanceContext.Provider value={appearanceState}>
            {children}
        </AppearanceContext.Provider>
    );
};
