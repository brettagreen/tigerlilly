import { Route, Navigate, Routes } from "react-router-dom";
import About from "./About";
import Admin from "./Admin";
import Login from "./Login";
import Logout from './Logout';
import SignUp from "./SignUp";
import Issue from './Issue';
import Article from './Article';
import Author from './Author';
import TestFileUpload from "./TestFileUpload";
import User from './User';
import Games from './Games';
import Redirects from './Redirects';
import ArticlePreview from "./ArticlePreview";
import SearchResults from "./SearchResults";
import ContactUs from "./ContactUs";

/**
 * @component /frontend/src/comonents/TigerlillyRoutes
 * @requires module:react-router-dom.Route
 * @requires module:react-router-dom.Navigate
 * @requires module:react-router-dom.Routes
 * @requires module:/frontend/src/components/About
 * @requires module:/frontend/src/components/Admin
 * @requires module:/frontend/src/components/Login
 * @requires module:/frontend/src/components/Logout
 * @requires module:/frontend/src/components/SignUp
 * @requires module:/frontend/src/components/issue
 * @requires module:/frontend/src/components/Article
 * @requires module:/frontend/src/components/Author
 * @requires module:/frontend/src/components/TestFileUpload
 * @requires module:/frontend/src/components/User
 * @requires module:/frontend/src/components/Games
 * @requires module:/frontend/src/components/Redirects
 * @requires module:/frontend/src/components/ArticlePreview
 * @requires module:/frontend/src/components/SearchResults
 * @requires module:/frontend/src/components/ContactUs
 * 
 * @description TigerlillyRoutes component. extension of BrowserRouter component as defined in the App component. 
 * components. specified path values on the Route objects determine which site Component is rendered. url values are 
 * read potential path matches IN ORDER i.e. top-down. 
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0

 * @returns {JSX.Element} BrowswerRouter Routes component which is comprised of individual Route objects. This is essentially
 * the BrowserRouter's navigation table.
 *
 * @example url path '/games' will render the Games component. '/heyiamapagethatdoesntexist/tacos!' will be sent to '/badrequest/noPage'
 * to be handled by the Redirects component.
 */
function TigerlillyRoutes({ updateUserToken, search }) {

    return (
        <Routes>
            <Route path="/" element={<Issue />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/issues/:id" element={<Issue />}/>
            <Route path="/articles/:id" element={<Article passedArticle={null} issueArticle={false} />}/>
            <Route path="/author/:handle" element={<Author />}/>
            <Route path="/signup" element={<SignUp updateUserToken={updateUserToken} />}/>
            <Route path="/login" element={<Login updateUserToken={updateUserToken} />}/>
            <Route path="/logout" element={<Logout updateUserToken={updateUserToken} />}/>
            <Route path="/profile" element={<User />}/>
            <Route path="/games" element={<Games />}/>
            <Route path="/articleKeywords/:keyword" element={<ArticlePreview />}/>
            <Route path="/searchResults" element={<SearchResults search={search} />}/>
            <Route path="/contact" element={<ContactUs />}/>
            <Route path="/testFileUpload" element={<TestFileUpload />}/>
            <Route path="/unauthorized/:type" element={<Redirects />}/>
            <Route path="/badrequest/:type" element={<Redirects />}/>
            <Route path="/formsubmitted/:type" element={<Redirects />}/>
            <Route path="/admin" element={<Admin />}/>
            <Route path="*" element={<Navigate to="/badrequest/noPage" replace />}/>
        </Routes>
    )

}

export default TigerlillyRoutes;