import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapContainer from "./MapContainer/MapContainer";

ReactDOM.render(
	<React.StrictMode>
		<MapContainer />
	</React.StrictMode>,
	document.getElementById('root'),
);
