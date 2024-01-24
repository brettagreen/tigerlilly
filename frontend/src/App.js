import TigerlillyApi from './api';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import UserContext from "./userContext";
import NavigationBar from './NavigationBar';
import TigerlillyRoutes from './TigerlillyRoutes';
import Box from '@mui/material/Box';
import './css/app.css';

function App() {
	
	const [localToken, localUser] = getLocalStorage();
  
	const [userToken, setUserToken] = useState(localToken);
	const [user, setUser] = useState(localUser);

	function getLocalStorage() {
		const token = localStorage.getItem('userToken');
		let user = localStorage.getItem('user');

		if (user) user = JSON.parse(user); else user = null;
  
		TigerlillyApi.token = token
  
		return [token, user];
	}

	function updateUserToken(value) {
		localStorage.setItem('userToken', value);
		TigerlillyApi.token = value;
		setUserToken(value);
	  }
	
	async function setCurrentUser(username) {
		if (!username) {
			localStorage.setItem('user', null);
			setUser(null);
		} else {
			const thisUser = await TigerlillyApi.getUser(username);
			console.log('thisUser.users', thisUser.users)
			localStorage.setItem('user', JSON.stringify(thisUser.users));
			setUser(thisUser.users);
		}
	
	}
	
	function profileUpdate(newUser) {
		setUser(newUser);
	}
	
	function isLoggedIn() {
		return !!user;
	}

	return (
		<UserContext.Provider value={{user, setCurrentUser}}>
			<div className="App">
				<BrowserRouter>
					<NavigationBar />
					<Box className="IssueBox" component="main">
						<TigerlillyRoutes profileUpdate={profileUpdate} isLoggedIn={isLoggedIn} updateUserToken={updateUserToken}/>
					</Box>
				</BrowserRouter>
			</div>
	  </UserContext.Provider>
	);
	
}

export default App;
