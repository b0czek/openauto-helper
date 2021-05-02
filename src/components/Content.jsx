import OilPressureGauge from "./OilPressureGauge";
import Watch from "./Watch";
import "./Content.scss";
const Content = () => (
    <div className="content">
        <OilPressureGauge ioName="oilpressure.0" />
        <Watch />
    </div>
);
export default Content;
