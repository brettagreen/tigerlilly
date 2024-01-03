import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class TigerlillyApi {
    // the token for interactive with the API will be stored here.
    static token;

    //turn form's json{} object into FormData() object
    static formData(form) {
        const formData = new FormData();
        const formEntries = Object.entries(form);
        
        for (let entry of formEntries) {
            formData.append(entry[0], entry[1]);
        }

        return formData;
    }

    static async request(endpoint, data = {}, method = "get") {

        //there are multiple ways to pass an authorization token, this is how you pass it in the header.
        //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${TigerlillyApi.token}`};
        const params = (method === "get") ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    //*** ALL ROUTES ***//

    //GENERIC GET REQUEST

    static async get(route) {
        return await this.request(`${route}`);
    }

    //GENERIC POST/PATCH/DELETE REQUEST

    static async commit(route, form, type, id = null) {
        const formData = (route==='users'||route==='authors') && type!=='delete'? this.formData(form): form;
        
        id = id === null ? '': id
        return await this.request(`${route}/${id}`, formData, type);
    }

    //USERS
    static async registerUser(form) {
        const formData = this.formData(form);

        return await this.request('users/register', formData, 'post');
    }

    static async getUser(username) {
        return await this.request(`users/username/${username}`);
    }

    static async loginUser(form) {
        return await this.request('users/login', form, 'post');
    }

    static async updateProfile(user, form) {
        const formData = this.formData(form);
        
        return await this.request(`users/${user}`, formData, 'patch');
    }

    //ARTICLES
    static async getArticle(id) {
        return await this.request(`articles/${id}`);
    }

    static async getAuthorArticles(handle) {
        return await this.request(`articles/authors/${handle}`);
    }

    static async getTaggedArticles(keyword) {
        return await this.request(`articles/keywords/${keyword}`);
    }

    //ISSUES
    static async getCurrentIssue() {
        return await this.request('issues/currentIssue'); 
    }

    static async getIssue(id) {
        return await this.request(`issues/${id}`);
    }

    //AUTHORS
    static async getAuthor(handle) {
        return await this.request(`authors/authorHandle/${handle}`);
    }

    //COMMENTS
    static async getComments(articleId, type) {
        return await this.request(`comments/${type}/${articleId}`);
    }

    static async getObjectsWithComments(type) {
        console.log('what is the type here?', type);
        return await this.request(`${type}/comments`);
    }

    //ARTICLE_KEYWORDS
    static async getArticleKeywords(articleId) {
        return await this.request(`keywords/${articleId}`);
    }

    ////////////////////testing stuff

    static async testUpload(form, username) {
        const formData = this.formData(form);

        formData.append('username', username);
        return await this.request('users/testFileUpload', formData, 'post');

    }

}

TigerlillyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhZ3JlZW4xIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjkzOTQ5NzY0fQ.NF5BFtpMbpqJWrrDcLcHWhgxWvqdMPIrnU0V4Gsl0WQ";

export default TigerlillyApi;