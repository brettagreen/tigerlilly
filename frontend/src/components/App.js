//typedefs
/**
 * @typedef {Object} user - user object 
 * @property {number} id 
 * @property {string} username
 * @property {string} userFirst
 * @property {string} userLast
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {string} icon
 *
*/

/**
 * @typedef {Object} article - article object
 * @property {number} articleId
 * @property {string} articleTitle
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string} authorHandle
 * @property {string} text
 * @property {number} issueId
 * @property {Date} pubDate
 */

import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/material/Box';
import UserContext from "../userContext";
import NavigationBar from './NavigationBar';
import TigerlillyRoutes from './TigerlillyRoutes';
import Footer from './Footer';
import TigerlillyApi from '../api';
import '../css/app.css';

/**
 * @component /frontend/src/comonents/App
 * @requires module:react-router-dom.BrowserRouter
 * @requires module:react.useState
 * @requires module:module:mui/material/Box
 * @requires module:/frontend/src/useContext
 * @requires module:/frontend/src/components/NavigationBar
 * @requires module:/frontend/src/components/TigerlillyRoutes
 * @requires module:/frontend/src/components/Footer
 * @requires module:/frontend/src/api
 * 
 * @description App component. Parent component of rest of application. Holds state variables related
 * to storing/retrieving user state, search state, and provides UseContext.Provider for downstream
 * components.
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} UserContext, NavBar, BrowserRouter and everything in between
 *
 */
function App() {
	/**
	 * local storage stashed user info
	 * @type {user}
	 */
	const localUser = getLocalStorage();
	/**
	 * make {user} stateful
	 * @type {user}
	 */
	const [user, setUser] = useState(localUser);

	/**
	 * @summary getter/setter. final search value as submitted by user.
	 * @type {string}
	 */
	const [searchString, setSearchString] = useState(null);
	/**
	 * getter/setter. array of string values extracted from raw searchString.
	 * basically, massaged data for backend components to handle
	 */
	const [searchArray, setSearchArray] = useState(null);
	/**
	 * returned article(s) that matched search criteria
	 * @type {article[]}
	 */
	const [searchResults, setSearchResults] = useState(null);
	/**
	 * getter/setter. search string value in the NavigationBar component's search field.
	 * @type {string}
	 */
	const [searchVal, setSearchVal] = useState('');

	/**
	 * gets user and token info from localstorage.
	 * assigns returned user value to user variable
	 * assigns token to TigerlillyApi
	 * @returns {user}
	 */
	function getLocalStorage() {
		const token = localStorage.getItem('userToken');
		let user = localStorage.getItem('user');

		if (user) user = JSON.parse(user); else user = null;
  
		TigerlillyApi.token = token
  
		return user;
	}

	/**
	 * set user token string to local storage
	 * and also tie it to site's api to help determine permissions
	 * @param {string} value 
	 */
	function updateUserToken(value) {
		localStorage.setItem('userToken', value);
		TigerlillyApi.token = value;
	}
	
	/**
	 * newly registered or logged in users will have their user object
	 * stored to local storage and save to state here
	 * @param {user} newUser 
	 * @returns {undefined}
	 */
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
