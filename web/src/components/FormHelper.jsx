class FormHelper {
    static checkedVal = event => (event.target.type === 'checkbox' ? event.target.checked : event.target.value)

    static getValue = event => event.target.value;

    static prevDef = event => event.preventDefault();
}
export default FormHelper;
