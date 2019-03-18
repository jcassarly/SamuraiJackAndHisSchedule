import React from 'react';
import PropTypes from 'prop-types';
import StandardEventForm from './StandardEventForm';
import LocationEventForm from './LocationEventForm';
import DeadlineForm from './DeadlineForm';
import InputForm from './InputForm';

import '../styles/StandardEventForm.css';

const EventEnum = {
    STANDARD: 'Standard',
    LOCATION: 'Location',
    DEADLINE: 'Deadline',
};

class ChooseEventTypeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Choose Event Type',
            choice: this.loadChooseInputForm,
            form: this.loadChooseInputForm,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static get propTypes() {
        return {
            returnHome: PropTypes.func.isRequired,
        };
    }

    loadStandardEventForm = () => {
        const { returnHome } = this.props;
        return <StandardEventForm returnHome={returnHome} />;
    }

    loadLocationEventForm = () => {
        const { returnHome } = this.props;
        return <LocationEventForm returnHome={returnHome} />;
    }

    loadDeadlineForm = () => {
        const { returnHome } = this.props;
        return <DeadlineForm returnHome={returnHome} />;
    }

    loadChooseInputForm = () => {
        const { returnHome } = this.props;
        const { title } = this.state;
        return (
            <InputForm onSubmit={this.handleSubmit} onBack={returnHome} title={title}>
                <div>
                    {'Choose Event Type: '}
                    <select onChange={this.handleInputChange}>
                        <option value="Choose">Choose</option>
                        <option value={EventEnum.STANDARD}>{EventEnum.STANDARD}</option>
                        <option value={EventEnum.LOCATION}>{EventEnum.LOCATION}</option>
                        <option value={EventEnum.DEADLINE}>{EventEnum.DEADLINE}</option>
                    </select>
                </div>
            </InputForm>
        );
    }

    handleInputChange(event) {
        this.setState({
            choice: event.target.value,
        });
    }

    handleSubmit(event) {
        const { choice } = this.state;
        switch (choice) {
        case EventEnum.STANDARD:
            this.setState({
                form: this.loadStandardEventForm,
            });
            break;
        case EventEnum.LOCATION:
            this.setState({
                form: this.loadLocationEventForm,
            });
            break;
        case EventEnum.DEADLINE:
            this.setState({
                form: this.loadDeadlineForm,
            });
            break;
        default:
            alert('Please select an event type');
            this.setState({
                form: this.loadChooseInputForm,
            });
            break;
        }
        event.preventDefault();
    }

    render() {
        const { form } = this.state;
        return form();
    }
}

export default ChooseEventTypeForm;
export { EventEnum };
