import ReactDOM from 'react-dom/client';
import Menu from './Menu';
import './styles/globals.css';
import './styles/fonts.css';
import './styles/transitions.css';

const console_error = console.error;

console.error = (..._args) => {
	const args = [..._args];

	if (args[0]?.search('createRoot()') > -1) return;

	console_error(...args);
};

ReactDOM.createRoot(document.body).render(<Menu />);
