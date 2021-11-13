import OilPressureGauge from "./OilPressureGauge";
import Watch from "./Watch";
import Thermometer from "./Thermometer";
import LightSensor from "./LightSensor";
import DayNight from "./DayNight";
import vanIcon from "../imgs/van.png";
import "./Content.scss";
const Content = () => (
    <div className="content">
        <OilPressureGauge ioName="oilpressure" />
        <Watch />
        <LightSensor ioName="lightSensor" />
        <Thermometer ioName="thermometer" iconPath={vanIcon} />
        <DayNight ioName="daynight" />
    </div>
);
export default Content;
