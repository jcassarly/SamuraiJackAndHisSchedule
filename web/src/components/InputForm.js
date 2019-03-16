import React from 'react';

function InputForm(props) {
    return (
        <div overflow="scroll">
            <center>
                <form onSubmit={props.onSubmit}>
                    <div>
                        <ul>
                            <li class="left"><button type="button" onClick={props.onBack}>Back</button></li>
                            <li><b>{props.title}</b></li>
                            <li class="right"><input type="submit" value="Submit" /></li>
                        </ul>
                    </div>
                    {props.children}
                </form>
            </center>
        </div>
    );
}

export default InputForm