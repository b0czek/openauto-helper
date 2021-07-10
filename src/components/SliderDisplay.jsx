import React from "react";

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
        let updateTimeout = 1 / this.props.updateSpeed;
        this.updateValue.bind(this)([updateTimeout, this.props.value]);
    }

    render() {
        return (
            <input
                type="range"
                readOnly={true}
                min={this.props.min ?? 0}
                max={this.props.max ?? 100}
                value={this.state.displayedValue}
                className={this.props.className}
                style={this.props.style}
            />
        );
    }
}

// const SliderDisplay = (props) => {
//     const [displayedValue, setDisplayValue] = React.useState(props.value);
//     const [currentUpdateJob, setCurrentUpdateJob] = React.useState(null);
//     const updateValue = async (params) => {
//         console.log(`params = ${params}`);
//         let [updateTimeout, updateTarget] = params;
//         if (displayedValue === updateTarget) {
//             return;
//         }
//         let newValue =
//             displayedValue - (updateTarget < displayedValue ? 1 : -1);
//         console.log(
//             `changing value ${displayedValue} to ${newValue}, target is ${updateTarget}`
//         );
//         setDisplayValue(newValue);

//         setTimeout(updateValue, updateTimeout, [updateTimeout, updateTarget]);
//     };
//     React.useEffect(() => {
//         clearTimeout(currentUpdateJob);
//         console.log(`value changed to ${props.value}`);
//         // update speed is just Hz
//         let updateTimeout = 1 / props.updateSpeed;
//         let updateJob = updateValue([updateTimeout, props.value]);
//         setCurrentUpdateJob(updateJob);
//     }, [props.value]);

//     return (

//     );
// };
export default SliderDisplay;
