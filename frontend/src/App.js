import './css/App.css';
import TigerlillyApi from './api';
import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import UserContext from "./userContext";
import Nav from './Nav';
import TigerlillyRoutes from './TigerlillyRoutes';

function App() {

	function getLocalStorage() {
		const token = localStorage.getItem('userToken');
		let user = localStorage.getItem('user');

		if (user) user = JSON.parse(user); else user = null;
  
		TigerlillyApi.token = token
  
		return [token, user];
	}
  
	const [localToken, localUser] = getLocalStorage();
  
	const [userToken, setUserToken] = useState(localToken);
	const [user, setUser] = useState(localUser);

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
		return user;
	}

	return (
		<UserContext.Provider value={{user, setCurrentUser}}>
			<div className="App">
				<BrowserRouter>
					<Nav isLoggedIn={isLoggedIn}></Nav>
					<TigerlillyRoutes profileUpdate={profileUpdate} isLoggedIn={isLoggedIn} updateUserToken={updateUserToken}/>
				</BrowserRouter>
			</div>
	  </UserContext.Provider>
	);
	
}

export default App;
