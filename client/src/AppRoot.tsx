import {CssBaseline} from '@mui/material';
import {Routes, Route, HashRouter} from 'react-router-dom';
import Header from './components/body/Header';
import Navbar from './components/body/Navbar';
import React from 'react';
import Notifications from './components/body/Notifications';
import Download from './components/tabs/Download';
import Downloaded from './components/tabs/Downloaded';
import Queue from './components/tabs/Queue';


export default function AppRoot() {
	return (
		<React.Fragment>
			<Notifications/>

			<HashRouter>
				<Header/>
				<Navbar/>

				<Routes>
					<Route element={<Download/>} path={'/'}/>

					<Route element={<Download/>} path='/tabs/download'/>
					<Route element={<Downloaded/>} path='/tabs/downloaded'/>
					<Route element={<Queue/>} path={'/tabs/queue'}/>
				</Routes>
			</HashRouter>
			<CssBaseline/>
		</React.Fragment>
	);
};