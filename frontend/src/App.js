import TigerlillyApi from './api';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import UserContext from "./userContext";
import NavigationBar from './NavigationBar';
import TigerlillyRoutes from './TigerlillyRoutes';
import Box from '@mui/material/Box';
import Footer from './Footer';
import './css/app.css';

function App() {
	
	const localUser = getLocalStorage();
	const [user, setUser] = useState(localUser);

	const [searchString, setSearchString] = useState(null);
	const [searchArray, setSearchArray] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [searchVal, setSearchVal] = useState('');

	function getLocalStorage() {
		const token = localStorage.getItem('userToken');
		let user = localStorage.getItem('user');

		if (user) user = JSON.parse(user); else user = null;
  
		TigerlillyApi.token = token
  
		return user;
	}

	function updateUserToken(value) {
		localStorage.setItem('userToken', value);
		TigerlillyApi.token = value;
	}
	
	async function setCurrentUser(newUser) {
		if (!newUser) {
			localStorage.setItem('user', null);
			setUser(null);
		} else {
			localStorage.setItem('user', JSON.stringify(newUser));
			setUser(newUser);
		}
	
	}

	return (
		<UserContext.Provider value={{user, setCurrentUser}}>
			<div className="App" style={{minHeight: '100vh'}}>
				<BrowserRouter>
					<NavigationBar search={[setSearchString, setSearchArray, setSearchResults, searchVal, setSearchVal]}/>
					<Box className="SiteBox" component="main">
						<TigerlillyRoutes updateUserToken={updateUserToken} search={[searchString, searchArray, searchResults]}/>
						<Footer />
					</Box>
				</BrowserRouter>
			</div>
	  </UserContext.Provider>
	);
	
}

export default App;
