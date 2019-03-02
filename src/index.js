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

class Summary extends React.Component {
  render() {
    var routeName = this.props.name.toLowerCase();
    var maxTime = Math.max.apply(null, this.props.data);
    var latestTime = this.props.data[this.props.data.length-1];
    return(
      <div className="summary">
        <div>Max {routeName} time: {maxTime} minutes</div>
        <div>Current {routeName} time: {latestTime} minutes</div>
      </div>
    )
  }
};

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
    };
  }
  render() {
    var selectorOptions = {
      buttons: [
        {
          label: "All time",
          step: "all"
        },
        {
          step: "day",
          stepmode: "todate",
          count: 1,
          label: "Today"
        },
        {
          step: "hour",
          stepmode: "backward",
          count: 1,
          label: "Past hour"
        }
      ]};
    var layout = {
      title: "Commute Time",
      xaxis: {
        rangeselector: selectorOptions,
        autorange: true      
      },
      yaxis: {
        //range: [0, 20],
        autorange: true
      }
    };


    console.log("in render() for chart");
    return (
      <div>
        <Plot
          data={[this.state.homeToWorkTrace, 
          this.state.workToGymTrace, 
          this.state.gymToHomeTrace]}
          layout={layout}
          onUpdate={(figure) => {
            console.log("in OnUpdate");
            console.log(figure);
            console.log(JSON.stringify(figure.data[0]));
            var startDate = figure.layout.xaxis.range[0];
            console.log("updating state")
            var newState = Object.assign(this.state);
            var newXRange1 = this.state.homeToWorkTrace.x.filter(e => e > startDate);
            newState.homeToWorkTrace.x = newXRange1;
            newState.homeToWorkTrace.y = this.state.homeToWorkTrace.y.slice(
              this.state.homeToWorkTrace.y.length - newXRange1.length);
            this.setState(newState);
            }}
          onSliderEnd={(figure) => console.log("in OnSliderEnd")}
          onButtonClicked={(figure) => console.log("in OnButtonClicked")}
        />
        <Summary 
          name={this.state.homeToWorkTrace.name}
          data={this.state.homeToWorkTrace.y}
        />
        <Summary
          name={this.state.workToGymTrace.name}
          data={this.state.workToGymTrace.y}
        />
        <Summary
          name={this.state.gymToHomeTrace.name}
          data={this.state.gymToHomeTrace.y}
        />
      </div>
    );
  }
}
// ========================================

ReactDOM.render(
  <Charts />,
  document.getElementById('root')
);