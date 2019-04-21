class FormHelper {
    static checkedVal = event => (event.target.type === 'checkbox' ? event.target.checked : event.target.value);

    static getValue = event => event.target.value;

    static getName = event => event.target.name;

    static prevDef = event => event.preventDefault();
}
export default FormHelper;
