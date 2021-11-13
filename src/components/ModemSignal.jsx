import styled from "styled-components";
import ApiFetchComponent from "./ApiFetchComponent";
import { ShortTile } from "./ContentTiles";
import "./ModemSignal.scss";
const NETWORK_TYPES = {
    0: "x",
    1: "GSM",
    2: "G",
    3: "E",
    4: "H",
    5: "H",
    6: "H",
    7: "H",
    9: "H+",
    17: "H+",
    18: "H+",
    19: "LTE",
};

const SignalBarsContainer = styled.div`
    &::before {
        position: absolute;
        top: -10px;
        left: -6px;
        font-size: 24px;
        content: "${({ networkType }) =>
            NETWORK_TYPES[networkType] ?? networkType}";
    }
`;

const SignalBars = (props) => {
    return (
        <div className={`score-${props.SignalIcon ?? "lost"}`}>
            <SignalBarsContainer
                className="signalBars"
                networkType={props.CurrentNetworkType}>
                <div className="signalBar"></div>
                <div className="signalBar"></div>
                <div className="signalBar"></div>
                <div className="signalBar"></div>
                <div className="signalBar"></div>
            </SignalBarsContainer>
        </div>
    );
};

class ModemSignal extends ApiFetchComponent {
    render() {
        return (
            <ShortTile>
                <ShortTile.Text>
                    <SignalBars {...this.state.apiState} />
                </ShortTile.Text>
            </ShortTile>
        );
    }
}

export default ModemSignal;
