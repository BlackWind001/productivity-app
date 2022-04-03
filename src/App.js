import React from "react";
import ChartSection from "./sections/ChartSection";
import InputSection from "./sections/InputSection";
import CurrentDayDataManipulationService from "./services/CurrentDayDataManipulationService";

function convertToChartDataStructure (productivityData) {
  const labels = Object.keys(productivityData);

  const data = labels.map((label) => {
    return productivityData[label].timeSpent;
  })

  return {
    labels,
    datasets: [{ data }]
  };
}

class App extends React.Component {
  constructor () {
    super();
    
    const { todaysData } = CurrentDayDataManipulationService;

    this.state = {
      todaysData
    }

    this.updateProductivityData = this.updateProductivityData.bind(this);
  }

  // updatedData is of the form { activityLabel, timeSpentOnActivity }
  updateProductivityData (updatedData) {
    let { activityLabel, timeSpentOnActivity } = updatedData;

    try {
      timeSpentOnActivity = parseFloat(timeSpentOnActivity);
    }
    catch (e) {
      timeSpentOnActivity = '';
    }

    CurrentDayDataManipulationService.updateData({ activity: activityLabel, timeSpent: timeSpentOnActivity })
    .then(() => {
      const { todaysData } = CurrentDayDataManipulationService;
      this.setState({
        todaysData
      });
    })
    .catch((err) => {
      alert(err);
    })
  }

  render () {
    console.log('App component rendering occurred');
    return (
      <>
        <ChartSection data={convertToChartDataStructure(this.state.todaysData)} />
        <InputSection
          handleUpdate={this.updateProductivityData}
        />
      </>
    );
  }
}

export default App;
