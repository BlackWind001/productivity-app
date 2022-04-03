import React from "react";
import { Chart, ArcElement, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './chart-section.scss'

Chart.register(ArcElement, Tooltip);

export default class ChartSection extends React.Component {
    render () {
        return (
            <section className="chart-section">
                <Pie data={this.props.data} options={ {maintainAspectRatio: false} } />
            </section>
        );
    }
}