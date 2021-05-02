import FogLightsSwitch from "./FogLightsSwitch";
import "./BottomBar.scss";
const BottomBar = () => (
    <div className="bottomBar">
        <div className="bottomBarContent">
            <FogLightsSwitch ioName="foglights.0" />
        </div>
    </div>
);
export default BottomBar;
