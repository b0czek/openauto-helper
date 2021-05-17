import ApiFetchComponent from "./ApiFetchComponent";
import { ShortTile } from "./ContentTiles";
import thermometerIcon from "../imgs/thermometer.png";
import "./Thermometer.scss";
class TemperatureTile extends ApiFetchComponent {
    render() {
        return (
            <ShortTile>
                <ShortTile.Text>
                    <img
                        src={thermometerIcon}
                        alt="thermometer"
                        className="thermometer"
                    />
                    <img
                        src={this.props.iconPath}
                        alt="icon"
                        className="icon"
                    />
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
