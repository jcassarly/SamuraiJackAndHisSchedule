import React from 'react';
import PropTypes from 'prop-types';
import StandardEventForm from './StandardEventForm';
import LocationEventForm from './LocationEventForm';
import DeadlineForm from './DeadlineForm';
import InputForm from './InputForm';

import ChooseEventTypeForm from '../../components/ChooseEventType';

/**
 * Event Enum class that represents the choices of event types available.
 */
const EventEnum = {
    STANDARD: 'Standard',
    LOCATION: 'Location',
    DEADLINE: 'Deadline',
};

/**
 * Component class that asks the user to choose an event type
 * and then renders the relevant form
 */
class ChooseEventTypeFormController extends React.Component {
    /**
     * Creates the form to choose the event
     * @param {func} props.returnHome a function that sends the user back to the home screen
     */
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

    /**
     * Gets the required types for the props passed into the constructor
     */
    static get propTypes() {
        return {
            returnHome: PropTypes.func.isRequired,
        };
    }

    /**
     * Returns the JSX object that displays the Standard Event input form
     */
    loadStandardEventForm = () => {
        const { returnHome } = this.props;
        return <StandardEventForm returnHome={returnHome} />;
    }

    /**
     * Returns the JSX object that displays the Location Event input form
     */
    loadLocationEventForm = () => {
        const { returnHome } = this.props;
        return <LocationEventForm returnHome={returnHome} />;
    }

    /**
     * Returns the JSX object that displays the Deadline input form
     */
    loadDeadlineForm = () => {
        const { returnHome } = this.props;
        return <DeadlineForm returnHome={returnHome} />;
    }

    /**
     * Returns the JSX object that displays the form that prompts the user to choose the event type
     */
    loadChooseInputForm = () => {
        const { returnHome } = this.props;
        const { title } = this.state;

        const vals = [
            'Choose',
            EventEnum.STANDARD,
            EventEnum.LOCATION,
            EventEnum.DEADLINE,
        ];
        return (
            <InputForm onSubmit={this.handleSubmit} onBack={returnHome} title={title}>
                <ChooseEventTypeForm handleInputChange={this.handleInputChange} values={vals} />
            </InputForm>
        );
    }

    /**
     * Updates the choice of event type the user made in the state
     * @param {obj} event the event object that stores the selection the user made
     */
    handleInputChange(event) {
        this.setState({
            choice: event.target.value,
        });
    }

    /**
     * Updates the form to the form chosen by the user when they click submit
     * @param {obj} event the event object that stores the event that called this function
     */
    handleSubmit(event) {
        const { choice } = this.state;

        // choose the form to load based on the user's selection
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
            // eslint-disable-next-line no-alert
            alert('Please select an event type');
            this.setState({
                form: this.loadChooseInputForm,
            });
            break;
        }
        event.preventDefault();
    }

    /**
     * Loads the correct input form based on the user's choice of event type.
     */
    render() {
        const { form } = this.state;

        // load the correct input form
        return form();
    }
}

export default ChooseEventTypeFormController;
export { EventEnum };
