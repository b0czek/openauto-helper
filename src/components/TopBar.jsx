import styled from "styled-components";

import EcoIndicator from "./EcoIndicator";
import Appearance, { getCurrentColors } from "../appearance";
import "./TopBar.scss";

const TopBarContainer = styled.div`
    background-color: ${({ backgroundColor }) => backgroundColor};
`;
const TopBar = () => {
    let appearance = Appearance.useContainer();
    return (
        <TopBarContainer className="topBar" backgroundColor={getCurrentColors(appearance).BarBackgroundColor}>
            <EcoIndicator ioName="eco" />
        </TopBarContainer>
    );
};

export default TopBar;
