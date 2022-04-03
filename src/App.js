import React from "react";
import ChartSection from "./sections/ChartSection";
import InputSection from "./sections/InputSection";

function convertToChartDataStructure (productivityData) {
  const labels = Object.keys(productivityData);

  if (labels.length >= 0) {
    const data = labels.map((label) => {
      return productivityData[label];
    })

    return {
      labels,
      datasets: [{ data }]
    };
  }

  return {
    labels: '',
    datasets: [{ data: [] }]
  };
}

class App extends React.Component {
  constructor () {
    super();
    
    this.state = {
      productivityData: {}
    }

    this.updateProductivityData = this.updateProductivityData.bind(this);
  }

  updateProductivityData (updatedData) {
    const { activityLabel, timeSpentOnActivity } = updatedData;
    const updatedProductivityData = this.state.productivityData;

    updatedProductivityData[activityLabel] = timeSpentOnActivity;

    this.setState({ productivityData: updatedProductivityData });
  }

  render () {
    console.log('App component rendering occurred');
    return (
      <>
        <ChartSection data={convertToChartDataStructure(this.state.productivityData)} />
        <InputSection
          handleUpdate={this.updateProductivityData}
        />
      </>
    );
  }
}

export default App;
