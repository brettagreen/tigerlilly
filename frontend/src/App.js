import TigerlillyApi from './api';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import UserContext from "./userContext";
import NavigationBar from './NavigationBar';
import TigerlillyRoutes from './TigerlillyRoutes';
import Box from '@mui/material/Box';
import './css/app.css';

function App() {
	
	const localUser = getLocalStorage();
	const [user, setUser] = useState(localUser);

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
			<div className="App">
				<BrowserRouter>
					<NavigationBar />
					<Box className="IssueBox" component="main">
						<TigerlillyRoutes updateUserToken={updateUserToken}/>
					</Box>
				</BrowserRouter>
			</div>
	  </UserContext.Provider>
	);
	
}

export default App;
