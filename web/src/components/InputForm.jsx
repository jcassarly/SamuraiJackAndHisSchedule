import React from 'react';
import PropTypes from 'prop-types';

function InputForm(props) {
    const {
        onSubmit,
        onBack,
        children,
        title,
    } = props;
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

InputForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
};

export default InputForm;
