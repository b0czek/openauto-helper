import ApiFetchComponent from "./ApiFetchComponent";
import { ShortTile } from "./ContentTiles";
import thermometerIcon from "../imgs/thermometer.png";
import vanIcon from "../imgs/van.png";
import "./Thermometer.scss";
class TemperatureTile extends ApiFetchComponent {
    render() {
        return (
            <ShortTile>
                <ShortTile.Text>
                    <img
                        src={thermometerIcon}
                        alt="thermometer"
                        className="temperatureIcon"
                        style={{ height: "48px" }}
                    />
                    <img src={vanIcon} alt="van" className="temperatureIcon" />
                </ShortTile.Text>
                <ShortTile.Content>
                    <div className="temperatureValue">
                        {this.state.apiState ?? "--"}
                    </div>
                </ShortTile.Content>
            </ShortTile>
        );
    }
}

export default TemperatureTile;
