import React from "react";
import ReactDOM from "react-dom";
import Plot from "react-plotly.js";
import "./index.css";

//TODO
//Front end
//Format chart with legends, 3 traces
//Store data in state

//Connecting front and back
//Put timer for re-querying data in ComponentDidMount
//Update data parser

//Back end
//Figure out why random pauses

//Additional features
//Time slider and buttons
//Map insert with color-coded routes
//Numeric label summary w/current times
//"Last refreshed"
//Promisified http library
//HEATMAP


class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeToWorkTrace: {
        x: ['2013-10-04 08:00:00', '2013-10-04 10:15:00', '2013-10-04 12:00:00'],
        y: [15, 10, 8],
        type: 'scatter',
        name: 'Home to work',
        mode: "lines"
      },
      workToGymTrace : {
        x: ['2013-10-04 08:15:00', '2013-10-04 10:06:00', '2013-10-04 12:55:00'],
        y: [12, 7, 10],
        type: 'scatter',
        name: 'Work to gym',
        mode: "lines"
      },
      gymToHomeTrace : {
        x: ['2013-10-04 08:05:00', '2013-10-04 10:16:00', '2013-10-04 12:15:00'],
        y: [15, 7, 12],
        type: 'scatter',
        name: 'Gym to home',
        mode: "lines"
      }
    }
  }
  render() {
    var selectorOptions = {
      buttons: [
        {
          step: "hour",
          stepmode: "backward",
          count: 1,
          label: "Past hour"
        },
        {
          step: "day",
          stepmode: "todate",
          count: 1,
          label: "Today"
        },
        {
          step: "all"
        }
      ]};
    var layout = {
      title: "Commute Time",
      xaxis: {
        rangeselector: selectorOptions,
        rangeslider: {
        }
      },
      yaxis: {
        range: [0, 20]
      }
    };

    return (
      <Plot
        data={[this.state.homeToWorkTrace, 
          this.state.workToGymTrace, 
          this.state.gymToHomeTrace]}
        layout={layout}
      />
    );
  }
}
// ========================================

ReactDOM.render(
  <Charts />,
  document.getElementById('root')
);