import ApiFetchComponent from "./ApiFetchComponent";
import { ShortTile } from "./ContentTiles";
import SliderDisplay from "./SliderDisplay";
import sunIcon from "../imgs/sun.png";
import "./ContentTiles.scss";
class LightSensor extends ApiFetchComponent {
    render() {
        return (
            <ShortTile>
                <ShortTile.Text>
                    <img src={sunIcon} alt="sun" className="shortTileIcon" />
                </ShortTile.Text>
                <ShortTile.Content>
                    <SliderDisplay
                        style={{ width: "100%" }}
                        max={400}
                        value={this.state.apiState ?? 0}
                        updateSpeed={100}
                    />
                </ShortTile.Content>
            </ShortTile>
        );
    }
}

export default LightSensor;
