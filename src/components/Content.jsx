import OilPressureGauge from "./OilPressureGauge";
import Watch from "./Watch";
import Thermometer from "./Thermometer";
import vanIcon from '../imgs/van.png';
import "./Content.scss";
const Content = () => (
    <div className="content">
        <OilPressureGauge ioName="oilpressure.0" />
        <Watch />
        <Thermometer ioName="ds18b20.0" iconPath={vanIcon} />
    </div>
);
export default Content;
