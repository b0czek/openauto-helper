import ecoIcon from "../imgs/eco.png";
import React from "react";
import ApiFetchComponent from "./ApiFetchComponent";
class EcoIndicator extends ApiFetchComponent {
    render() {
        return (
            <div
                className="ecoIndicatorContainer"
                onClick={() => this.handleApiRequest("toggle")}>
                <img
                    src={ecoIcon}
                    alt="eco"
                    className={`unselectable ecoIndicator ${
                        this.state.apiState ? "" : "ecoIndicatorInactive"
                    }`}
                />
            </div>
        );
    }
}

export default EcoIndicator;
