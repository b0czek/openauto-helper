import TopBar from "./TopBar";
import Content from "./Content";
import BottomBar from "./BottomBar";
import "./App.scss";
const App = () => (
    <div className="container">
        <TopBar />
        <Content />
        <BottomBar />
    </div>
);

export default App;
