import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import DateTime from 'react-datetime';

import '../styles/InputFields.css';

/**
 * Create a React Component that contains a text and input field
 * @param {string} props.description the description of the input to gather
 * @param {string} props.type        the type of input to gather
 * @param {string} props.name        the name of the input field
 * @param {any}    props.value       the value stored in the input field
 * @param {bool}   props.checked     whether or not the input field is checked
 * @param {func}   props.onChange    a function to handle changes to the input field
 * @param {node}   props.children    Extra text to show after the input field for
 *                                   further directions for the user
 */
function BaseInput(props) {
    const {
        description,
        type,
        name,
        value,
        checked,
        onChange,
        children,
    } = props;
    return (
        <div className="baseBorder">
            {description}
            {': '}
            <input
                type={type}
                name={name}
                value={value}
                checked={checked}
                placeholder={description}
                onChange={onChange}
            />
            {children}
        </div>
    );
}

// defines the object that checks the props passed into the BaseInput
BaseInput.propTypes = {
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node,
};

// defines the object that specified the default values for non-required props
BaseInput.defaultProps = {
    value: undefined,
    checked: false,
    children: null,
};

/**
 * Create a react component that gets a start and end time from a user
 * @param {string} props.startDescription The description of the start time
 * @param {moment} props.start            The object that stores the start time
 * @param {func}   props.onStartChange    The function that handles changes to the start input
 * @param {string} props.endDescription   The description of the end time
 * @param {moment} props.end              The object that stores the end time
 * @param {func}   props.onEndChange      The function that handles changes to the end input
 */
function StartEndInput(props) {
    const {
        startDescription,
        start,
        onStartChange,

        endDescription,
        end,
        onEndChange,
    } = props;
    return (
        <div className="baseBorder">
            <div className="center">
                <div className="left">
                    <div>
                        {startDescription}
                    </div>
                    <DateTime
                        inputProps={{ placeholder: startDescription }}
                        value={start}
                        onChange={onStartChange}
                    />
                </div>
                <div className="left">
                    <div>
                        {endDescription}
                    </div>
                    <DateTime
                        inputProps={{ placeholder: endDescription }}
                        value={end}
                        onChange={onEndChange}
                    />
                </div>
            </div>
        </div>
    );
}

// defines the object that checks the props passed into the StartEndInput
StartEndInput.propTypes = {
    startDescription: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(moment).isRequired,
    onStartChange: PropTypes.func.isRequired,

    endDescription: PropTypes.string.isRequired,
    end: PropTypes.instanceOf(moment).isRequired,
    onEndChange: PropTypes.func.isRequired,
};

/**
 * Create a React Component that gets input from a select field with a prompt
 * @param {string} props.prompt   a description of the input the user is entering
 * @param {string} props.name     the name of the React Component
 * @param {string} props.value    the selection
 * @param {func}   props.onChange a function to handle changes to the input field
 * @param {array}  props.options a list of value, content pairs to display in the list
 */
function SelectInput(props) {
    const {
        prompt,
        name,
        value,
        onChange,
        options,
    } = props;
    return (
        <div className="baseBorder">
            {prompt}
            {': '}
            <select name={name} value={value} onChange={onChange}>
                {options.map(({ value, contents }) => (
                    <option key={value} value={value}>
                        {contents}
                    </option>
                ))}
            </select>
        </div>
    );
}

// defines the object that checks the props passed into the SelectionInput
SelectInput.propTypes = {
    prompt: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        contents: PropTypes.node,
    })).isRequired,
};

// defines the object that specified the default values for non-required props
SelectInput.defaultProps = {
    children: null,
};

export {
    BaseInput,
    StartEndInput,
    SelectInput,
};
