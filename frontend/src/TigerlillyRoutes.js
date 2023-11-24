import { Route, Navigate, Routes } from "react-router-dom";
import Admin from "./Admin";
import Login from "./Login";
import Logout from './Logout';
import SignUp from "./SignUp";
import Issue from './Issue';
import Article from './Article';
import Author from './Author';
import User from './User';
import Error from './401';

function TigerlillyRoutes({ profileUpdate, isLoggedIn, updateUserToken }) {

    return (
        <Routes>
            <Route path="/" element={<Issue />}/>
            <Route path="/issues/:id" element={<Issue />}/>
            <Route path="/articles/:id" element={<Article />}/>
            <Route path="/author/:handle" element={<Author />}/>
            <Route path="/signup" element={<SignUp updateUserToken={updateUserToken}/>}/>
            <Route path="/login" element={<Login updateUserToken={updateUserToken}/>}/>
            <Route path="/logout" element={<Logout updateUserToken={updateUserToken}/>}/>
            <Route path="/profile" element={<User isLoggedIn={isLoggedIn()} profileUpdate={profileUpdate}/>}/>
            <Route path="/unauthorizeProfile" element={<Error type="profileError"/>}/>
            <Route path="/unauthorizedAdmin" element={<Error type="adminError"/>}/>
            <Route path="/badrequest" element={<Error type="nopage"/>}/>
            <Route path="/admin" element={<Admin isAdmin={isLoggedIn() ? isLoggedIn().isAdmin : false}/>}/>
            <Route path="*" element={<Navigate to="/badrequest" replace/>}/>
        </Routes>
    )

}

export default TigerlillyRoutes;