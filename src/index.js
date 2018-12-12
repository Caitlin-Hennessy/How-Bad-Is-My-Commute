import React from "react";
import ReactDOM from "react-dom";
import Plot from "react-plotly.js";
import "./index.css";

var date0 = new Date(2018, 12, 10, 8);
var date1 = new Date(2018, 12, 10, 12, 1);
var date2 = new Date(2018, 12, 10, 12, 6);
var date3 = new Date(2018, 12, 10, 17, 15);
var date4 = new Date(2018, 12, 10, 20);

var testData = {
  [date0]: {
    home_work: 10,
    work_gym: 10,
    gym_home: 6
  },
  [date1]: {
    home_work: 15,
    work_gym: 12,
    gym_home: 10
  },
  [date2]: {
    home_work: 17,
    work_gym: 14,
    gym_home: 12
  },
  [date3]: {
    home_work: 35,
    work_gym: 20,
    gym_home: 26
  },
  [date4]: {
    home_work: 14,
    work_gym: 11,
    gym_home: 10
  }
}

function getDisplayTime(dateStr) {
  var dateObj = new Date(dateStr);
  var minutes = dateObj.getMinutes();
  return `${dateObj.getHours()}:${minutes < 10 ? "0" + minutes : minutes}`;
}

function getZData(timeData) {
  var zData = [];
  var i = 0;
  var timestamps = Object.keys(timeData);

  var getTotalTravelTime = (xTime, yTime) => {
    var departGymTime = new Date(new Date(yTime).getTime() + 5400000).toString();
    var gymHomeTravelTime = 6;
    if (timestamps.includes(departGymTime)) {
      gymHomeTravelTime = timestamps[departGymTime].gym_home;
    }
    return (
      timeData[xTime].home_work +
      timeData[yTime].work_gym + 
      gymHomeTravelTime
    );
  }

  for (var xTime of timestamps) {
    zData.push([]);
    for (var yTime of timestamps) {
      zData[i].push(getTotalTravelTime(xTime, yTime));
    }
    ++i;
  }

  return zData;
}

class Charts extends React.Component {
  render() {
    console.log(getZData(testData));
    return (
      <Plot
        data={[
          {
            //z: [[1, 20, 30], [20, 1, 60], [30, 60, 1]],
            z: getZData(testData),
            type: 'heatmap',
            colorscale: "Bluered"
          },
        ]}
        layout={ {
          width: 720, 
          height: 480, 
          title: 'Total travel time', 
          xaxis: {
            ticktext: (Object.keys(testData).map(getDisplayTime)),
            tickvals: [0, 1, 2, 3, 4],
            title: "Leave work"
          }, 
          yaxis: {
            title: "Leave home",
            ticktext: (Object.keys(testData).map(getDisplayTime)),
            tickvals: [0, 1, 2, 3, 4]
          }} 
        }
      />
    );
  }
}

// ========================================

ReactDOM.render(
  <Charts />,
  document.getElementById('root')
);