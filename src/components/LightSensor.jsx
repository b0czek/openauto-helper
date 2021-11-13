import { subscribeAsProp } from "../appearance";

import ApiFetchComponent from "./ApiFetchComponent";
import { ShortTile } from "./ContentTiles";
import SliderDisplay from "./SliderDisplay";
import sunIcon from "../imgs/sun.png";
import moonIcon from "../imgs/moon.png";
import "./ContentTiles.scss";
class LightSensor extends ApiFetchComponent {
    state = {
        displayValue: false,
    };
    toggleDisplay = () => {
        this.setState({
            displayValue: !this.state.displayValue,
        });
    };
    render() {
        return (
            <ShortTile onClick={this.toggleDisplay}>
                <ShortTile.Text>
                    <img
                        src={this.props.appearance.daynight === "night" ? moonIcon : sunIcon}
                        alt="sun"
                        className="shortTileIcon"
                    />
                </ShortTile.Text>
                <ShortTile.Content>
                    <SliderDisplay max={400} value={this.state.apiState ?? 0} displayValue={this.state.displayValue} />
                </ShortTile.Content>
            </ShortTile>
        );
    }
}

export default subscribeAsProp(LightSensor);
