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

class SliderDisplay extends React.Component {
    state = {
        currentUpdateJob: null,
        displayedValue: this.props.value,
    };
    updateValue = (params) => {
        let [updateTimeout, updateTarget] = params;
        if (updateTarget === this.state.displayedValue) {
            return;
        }
        let newValue =
            this.state.displayedValue -
            (updateTarget < this.state.displayedValue ? 1 : -1);
        this.setState(
            {
                displayedValue: newValue,
            },
            () => {
                setTimeout(this.updateValue.bind(this), updateTimeout, [
                    updateTimeout,
                    updateTarget,
                ]);
            }
        );
    };

    componentDidUpdate() {
        // update speed is just Hz
        // let updateTimeout = 1 / this.props.updateSpeed;
        // this.updateValue.bind(this)([updateTimeout, this.props.value]);
    }

    render() {
        return (
            <Slider
                type="range"
                readOnly={true}
                min={this.props.min ?? 0}
                max={this.props.max ?? 100}
                value={this.props.value}
                style={this.props.style}
                progressColor={
                    getCurrentColors(this.props.appearance).ControlForeground
                }
            />
        );
    }
}

export default subscribeAsProp(SliderDisplay);
