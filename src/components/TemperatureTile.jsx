import ApiFetchComponent from "./ApiFetchComponent";
import { ShortTile } from "./ContentTiles";
import "./TemperatureTile.scss";
class TemperatureTile extends ApiFetchComponent {
    render() {
        return (
            <ShortTile>
                <ShortTile.Text>
                    <div>temperatura:</div>
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
