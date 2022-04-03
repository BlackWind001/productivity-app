import React from 'react';
import './input-section.scss'

export default class InputSection extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            activityData: {
                activityLabel: '',
                timeSpentOnActivity: ''
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange (field, event) {
        let value = event.target.value;
        let updatedActivityData = this.state.activityData;

        updatedActivityData[field] = value;

        this.setState({ activityData: updatedActivityData });
    }

    handleSubmit (event) {
        event.preventDefault();

        this.props.handleUpdate(this.state.activityData);
        this.resetInputs();
    }

    resetInputs () {
        this.setState({
            activityData: {
                activityLabel: '',
                timeSpentOnActivity: ''
            }
        });
    }


    render () {
        return (
        <section className='input-section'>
            <form className='input-section-form' onSubmit={this.handleSubmit}>
                <fieldset>
                    <legend>Label for the activity</legend>
                    <input type='text' value={this.state.activityData.activityLabel} onChange={this.handleChange.bind(this, 'activityLabel')}/>
                </fieldset>
                <fieldset>
                    <legend>Time spent on the activitiy in hours</legend>
                    <input type='text' value={this.state.activityData.timeSpentOnActivity} onChange={this.handleChange.bind(this, 'timeSpentOnActivity')}/>
                </fieldset>
                <input type='submit' value='Add data' />
            </form>
        </section>
        );
    }
}