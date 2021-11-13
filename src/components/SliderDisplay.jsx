import React from "react";
import styled from "styled-components";
import { subscribeAsProp, getCurrentColors } from "../appearance";

const getSliderGradient = ({ progressColor, value, max }) => {
    let progressWidth = `${(value / max) * 100}%`;
    return `
    linear-gradient(
        to right,
        ${progressColor} 0%,
        ${progressColor} ${progressWidth},
        #fff ${progressWidth},
        #fff 100%
    )`;
};

const Slider = styled.input`
    width: 100%;
    background: ${(props) => getSliderGradient(props)};
    border-radius: 8px;
    height: 4px;
    outline: none;
    transition: background 450ms ease-in;
    -webkit-appearance: none;
    &:focus {
        outline: none;
    }
    &::-webkit-slider-thumb {
        background-color: ${({ progressColor }) => progressColor};
        border-radius: 0;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        -webkit-appearance: none;
    }
`;

const DataDisplay = styled.div`
    width: 120px;
    margin-left: 10px;
`;

class SliderDisplay extends React.Component {
    render() {
        return (
            <>
                <Slider
                    type="range"
                    readOnly={true}
                    min={this.props.min ?? 0}
                    max={this.props.max ?? 100}
                    value={this.props.value}
                    style={this.props.style}
                    progressColor={getCurrentColors(this.props.appearance).ControlForeground}
                />
                {this.props.displayValue ? <DataDisplay>{Math.floor(this.props.value)}</DataDisplay> : null}
            </>
        );
    }
}

export default subscribeAsProp(SliderDisplay);
