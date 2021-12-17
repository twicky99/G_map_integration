import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapField from "./MapContainer/MapField";

ReactDOM.render(
	<React.StrictMode>
		<MapField />
	</React.StrictMode>,
	document.getElementById('root'),
);
