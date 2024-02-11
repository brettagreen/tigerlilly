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
import Error from './401';
import ArticlePreview from "./ArticlePreview";

function TigerlillyRoutes({ updateUserToken }) {

    return (
        <Routes>
            <Route path="/" element={<Issue />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/issues/:id" element={<Issue />}/>
            <Route path="/articles/:id" element={<Article />}/>
            <Route path="/author/:handle" element={<Author />}/>
            <Route path="/signup" element={<SignUp updateUserToken={updateUserToken}/>}/>
            <Route path="/login" element={<Login updateUserToken={updateUserToken}/>}/>
            <Route path="/logout" element={<Logout updateUserToken={updateUserToken}/>}/>
            <Route path="/profile" element={<User />}/>
            <Route path="/articleKeywords/:keyword" element={<ArticlePreview/>}/>
            <Route path="/testFileUpload" element={<TestFileUpload/>}/>
            <Route path="/unauthorized/:type" element={<Error />}/>
            <Route path="/badrequest/:type" element={<Error />}/>
            <Route path="/admin" element={<Admin />}/>
            <Route path="*" element={<Navigate to="/badrequest/noPage" replace/>}/>
        </Routes>
    )

}

export default TigerlillyRoutes;