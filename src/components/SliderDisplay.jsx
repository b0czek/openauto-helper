import React from "react";

class SliderDisplay extends React.Component {
    render() {
        return (
            <input
                type="range"
                readOnly={true}
                min={this.props.min ?? 0}
                max={this.props.max ?? 100}
                value={this.props.value}
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
