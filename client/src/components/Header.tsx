import {AppBar, Toolbar, Typography} from '@mui/material';
import React from 'react';


export default function Header() {
	return (
		<AppBar position='sticky'>
			<Toolbar variant='dense'>
				<Typography color='inherit' variant='h6'>
					YouTube Downloader
				</Typography>
			</Toolbar>
		</AppBar>
	);
}