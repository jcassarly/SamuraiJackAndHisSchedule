import React from 'react';
import StandardEventForm from './StandardEventForm'

import '../styles/StandardEventForm.css';
import LocationEventForm from './LocationEventForm';
import DeadlineForm from './DeadlineForm'
import InputForm from './InputForm'

var EventEnum = {
    STANDARD: "Standard",
    LOCATION: "Location",
    DEADLINE: "Deadline",
}

class ChooseEventTypeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Choose Event Type",
            choice: this.loadChooseInputForm,
            form: this.loadChooseInputForm,
            submitted: false,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.returnHome = this.returnHome.bind(this);
    }

    returnHome(event) {
        alert("TODO: return to home screen")
    }

    handleInputChange(event) {
        this.setState({
            choice: event.target.value,
        });
    }

    loadStandardEventForm = () => {
        return <StandardEventForm />;
    }

    loadLocationEventForm = () => {
        return <LocationEventForm />;
    }

    loadDeadlineForm = () => {
        return <DeadlineForm />;
    }

    loadChooseInputForm = () => {
        return (
            <InputForm onSubmit={this.handleSubmit} onBack={this.returnHome} title={this.state.title}>
                <div>
                    <label>
                        Choose Event Type:
                    </label>
                    <select onChange={this.handleInputChange}>
                        <option value="Choose">Choose</option>
                        <option value={EventEnum.STANDARD}>{EventEnum.STANDARD}</option>
                        <option value={EventEnum.LOCATION}>{EventEnum.LOCATION}</option>
                        <option value={EventEnum.DEADLINE}>{EventEnum.DEADLINE}</option>
                    </select>
                </div>
            </InputForm>
        )
    }

    handleSubmit(event) {
        switch (this.state.choice) {
            case EventEnum.STANDARD:
                this.setState({
                    form: this.loadStandardEventForm
                })
                break;
            case EventEnum.LOCATION:
                this.setState({
                    form: this.loadLocationEventForm
                })
                break;
            case EventEnum.DEADLINE:
                this.setState({
                    form: this.loadDeadlineForm
                })
                break;
            default:
                alert("Please select an event type");
                this.setState({
                    form: this.loadChooseInputForm
                })
                break;
        }
        event.preventDefault();
    }

    render() {
        return this.state.form()
    }
}

export default ChooseEventTypeForm