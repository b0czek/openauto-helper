import OilPressureGauge from "./OilPressureGauge";
import Watch from "./Watch";
import TemperatureTile from "./TemperatureTile";
import "./Content.scss";
const Content = () => (
    <div className="content">
        <OilPressureGauge ioName="oilpressure.0" />
        <Watch />
        <TemperatureTile ioName="ds18b20.0" />
    </div>
);
export default Content;
