import styled from "styled-components";

import FogLightsSwitch from "./FogLightsSwitch";
import Appearance, { getCurrentColors } from "../appearance";
import "./BottomBar.scss";

const BottomBarContainer = styled.div`
    background-color: ${({ backgroundColor }) => backgroundColor};
    border-top: 1px solid ${({ shadowColor }) => shadowColor};
`;
const BottomBar = () => {
    let appearance = Appearance.useContainer();
    return (
        <BottomBarContainer
            className="bottomBar"
            backgroundColor={getCurrentColors(appearance).BarBackgroundColor}
            shadowColor={getCurrentColors(appearance).BarShadowColor}>
            <div className="bottomBarContent">
                <FogLightsSwitch ioName="foglights.0" />
            </div>
        </BottomBarContainer>
    );
};
export default BottomBar;
