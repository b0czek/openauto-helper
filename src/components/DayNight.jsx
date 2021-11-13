import ChartistGraph from "react-chartist";
import styled from "styled-components";

import ApiFetchComponent from "./ApiFetchComponent";
import ContentTiles from "./ContentTiles";
import { getCurrentColors, subscribeAsProp } from "../appearance";
import balanceScale from "../imgs/balancescale.svg";
import "./DayNight.scss";
import "../index.scss";

const average = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length || 0).toFixed(1);

const ChartWrapper = styled.div`
    .ct-series-a {
        .ct-line,
        .ct-point {
            stroke: ${({ graphColor }) => graphColor};
        }
        .ct-area {
            fill: ${({ graphColor }) => graphColor};
        }
    }
`;

class DayNight extends ApiFetchComponent {
    componentDidMount() {
        this.initializeApi();
        this.initApiListener("data");
    }
    getData() {
        return {
            series: [this.state.data?.samples ?? []],
        };
    }
    render() {
        let options = {
            width: "380px",
            height: "250px",
            showPoint: false,
            showArea: true,
            low: 0,
        };
        return (
            <ContentTiles>
                <ContentTiles.Content>
                    <ChartWrapper graphColor={getCurrentColors(this.props.appearance).ControlForeground}>
                        <ChartistGraph data={this.getData()} options={options} type="Line" className="daynightChart" />
                    </ChartWrapper>
                </ContentTiles.Content>
                <ContentTiles.Text>
                    <div className="centerChildren">
                        <img src={balanceScale} className="invertColors dataDisplayIcon" alt="Data Icon" />
                        <div>{average(this.state.data?.samples ?? [])}</div>
                    </div>
                </ContentTiles.Text>
            </ContentTiles>
        );
    }
}
export default subscribeAsProp(DayNight);
