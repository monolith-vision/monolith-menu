import ReactDOM from 'react-dom/client';
import { isEnvBrowser } from './lib';

// Styles
import './styles/globals.css';
import './styles/fonts.css';
import './styles/transitions.css';

// Components
import Menu from '@/features/menu/Menu';
import InputDialog from '@/features/dialog/Dialog';

if (isEnvBrowser) document.body.style.backgroundColor = '#1e1e1e';

ReactDOM.createRoot(document.body).render(
	<>
		<Menu />
		<InputDialog />
	</>,
);
