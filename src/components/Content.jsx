import OilPressureGauge from "./OilPressureGauge";
import Watch from "./Watch";
import Thermometer from "./Thermometer";
import LightSensor from "./LightSensor";
import ModemSignal from "./ModemSignal";
import vanIcon from "../imgs/van.png";
import "./Content.scss";
const Content = () => (
    <div className="content">
        <OilPressureGauge ioName="oilpressure.0" />
        <Watch />
        <LightSensor ioName="lightSensor" />
        <Thermometer ioName="thermometer.0" iconPath={vanIcon} />
        <ModemSignal ioName="modemSignal" />
    </div>
);
export default Content;
