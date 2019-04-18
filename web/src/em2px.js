const div = document.getElementById('em-px');
div.style.height = '1em';
const em = div.offsetHeight;
div.style.height = '0';

export default em;
