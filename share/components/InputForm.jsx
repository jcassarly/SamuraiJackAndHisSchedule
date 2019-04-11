import React from 'react';
import PropTypes from 'prop-types';

/**
 * Create a react component that surrounds the input fields and handles submission and back buttons
 * @param {func}  props.onSubmit a function that handles the submission event
 * @param {func}  props.onBack   a function that handles returning home when the back
 *                               button is clicked
 * @param {node}  props.children the child nodes that contain the input fields
 * @param {title} props.title    the name of the input form
 */
function InputForm(props) {
    const {
        onSubmit,
        onBack,
        children,
        title,
    } = props;
    // create a form with the submit and back buttons and all other input fields in children
    return (
        <div overflow="scroll">
            <center>
                <form onSubmit={onSubmit}>
                    <div>
                        <ul>
                            <li className="left"><button type="button" onClick={onBack}>Back</button></li>
                            <li><b>{title}</b></li>
                            <li className="right"><input type="submit" value="Submit" /></li>
                        </ul>
                    </div>
                    {children}
                </form>
            </center>
        </div>
    );
}

// defines the object that checks the props passed into the InputForm
InputForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
};

export default InputForm;
