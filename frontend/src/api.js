import axios from "axios";

/**
 * site url
 * @type {string}
 */
const BASE_URL = "http://ec2-35-175-195-228.compute-1.amazonaws.com:3001";
//console.log('process...', process.env.TIGERLILLY_BASE_URL);
//console.log('BASE...', BASE_URL);
/**
 * @module /frontend/src/api
 * @requires module:axios
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @class
 * @classdesc Static class tying together methods used to get/send to to the API.
 * There is nothing frontend-specific here; this is all related to the backend and the database
 */
class TigerlillyApi {
    /**
     * the token for interaction with the API will be stored here.
     * @type {string}
     */
    static token;

    /**
     * turn form's json{} object into FormData() object.
     * this is required for form's that pass file objects
     * @param {Object} form 
     * @returns {FormData}
     */
    static formData(form) {
        const formData = new FormData();
        const formEntries = Object.entries(form);
        
        for (let entry of formEntries) {
            formData.append(entry[0], entry[1]);
        }

        return formData;
    }

    /**
     * pass auth token in the header. initiate axios http request
     * @function
     * @name request
     * @param {string} endpoint - full url
     * @param {Object={}} data - key/value object
     * @param {string=get} method - http method: get, post, delete, patch...
     * @throws {Error} error object related to whatever the backend error was
     * @returns {Object} data returned from backend
     */
    static async request(endpoint, data = {}, method = "get") {
        /**
         * base_url value + endpoint
         * @type {string}
         */
        const url = `${BASE_URL}/${endpoint}`;
        /**
         * auth header
         * @type{string}
         */
        const headers = { Authorization: `Bearer ${TigerlillyApi.token}`};
        /**
         * url params, if any
         * @type {Object}
         */
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

    /**
     * get request
     * @function
     * @name get
     * @param {string} route - full url. base + endpoint
     * @returns {Object} data returned from backend
     */
    static async get(route) {
        return await this.request(`${route}`);
    }

    /**
     * post/patch/delete request
     * @function
     * @name commit
     * @param {string} route - full url. base + endpoint
     * @param {Object} form - key/value form object
     * @param {string} type - type of request. i.e. post/patch/delete
     * @param {number=null} id - id value of database object in question
     * @returns {Object} data returned from backend
     */
    static async commit(route, form, type, id = null) {
        const formData = (route==='users'||route==='authors') && type!=='delete'? this.formData(form): form;
        
        id = id === null ? '': id
        return await this.request(`${route}/${id}`, formData, type);
    }

    //USERS

    /**
     * register new user
     * @function
     * @name registerUser
     * @param {Object} form register user form data
     * @returns {Object} data returned from backend
     */
    static async registerUser(form) {
        const formData = this.formData(form);
        return await this.request('users/register', formData, 'post');
    }

    /**
     * retrieve user info by username
     * @function
     * @name getUser
     * @param {string} username username of User object in question 
     * @returns {Object} data returned from backend
     */
    static async getUser(username) {
        return await this.request(`users/username/${username}`);
    }

    /**
     * log user into the website
     * @function
     * @name loginUser
     * @param {Object} form login user form data
     * @returns {Object} data returned from backend
     */
    static async loginUser(form) {
        return await this.request('users/login', form, 'post');
    }

    /**
     * update user profile
     * @function
     * @name updateProfile
     * @param {number} id id of User object in question
     * @param {Object} form update user form data
     * @returns {Object} data returned from backend
     */
    static async updateProfile(id, form) {
        const formData = this.formData(form);
        
        return await this.request(`users/${id}`, formData, 'patch');
    }

    //ARTICLES

    /**
     * get article by id
     * @function
     * @name getArticle
     * @param {number} id id value of Article object in question
     * @returns {Object} data returned from backend
     */
    static async getArticle(id) {
        return await this.request(`articles/${id}`);
    }

    /**
     * get articles by author handle
     * @function
     * @name getAuthorArticles
     * @param {number} handle handle value of Article objects in question
     * @returns {Object} data returned from backend
     */
    static async getAuthorArticles(handle) {
        return await this.request(`articles/authors/${handle}`);
    }

    /**
     * get articles by keyword
     * @function
     * @name getTaggedArticles
     * @param {string} keyword keywrod value to match Article objects on
     * @returns {Object} data returned from backend
     */
    static async getTaggedArticles(keyword) {
        return await this.request(`articles/keywords/${keyword}`);
    }

    //ISSUES

    /**
     * get current issue
     * @function
     * @name getCurrentIssue
     * @returns {Object} data returned from backend
     */
    static async getCurrentIssue() {
        return await this.request('issues/currentIssue'); 
    }

    /**
     * get issue by id
     * @function
     * @name getIssue
     * @param {number} id id of Issue object in question
     * @returns {Object} data returned from backend
     */
    static async getIssue(id) {
        return await this.request(`issues/${id}`);
    }

    //AUTHORS

    /**
     * get Author by handle
     * @function
     * @name getAuthor
     * @param {string} handle handle of Author object in question
     * @returns {Object} data returned from backend
     */
    static async getAuthor(handle) {
        return await this.request(`authors/authorHandle/${handle}`);
    }

    // //COMMENTS
    // static async getComments(articleId, type) {
    //     return await this.request(`comments/${type}/${articleId}`);
    // }

    // static async getObjectsWithComments(type) {
    //     console.log('what is the type here?', type);
    //     return await this.request(`${type}/comments`);
    // }

    //FEEDBACK

    /**
     * post user feedback to database
     * @function
     * @name postFeedback
     * @param {Object} form feedback form data
     * @returns {Object} data returned from backend
     */
    static async postFeedback(form) {
        return await this.request('users/feedback', form, 'post');
    }

    //ARTICLE_KEYWORDS

    /**
     * get all keywords associated with a certain Article by Article id
     * @function
     * @name getArticleKeywords
     * @param {number} articleId id of Article in question
     * @returns {Object} data returned from backend
     */
    static async getArticleKeywords(articleId) {
        return await this.request(`keywords/${articleId}`);
    }

    /**
     * Article search based on keywords and/or hashtags
     * @param {[string]} kwdArray 
     * @returns {Object} Article data returned from backend matching search
     */
    static async search(kwdArray) {
        const kwds = kwdArray.join(',');

        return await this.request(`articles/search/${kwds}`);
    }

    ////////////////////testing stuff

    static async testUpload(form, username) {
        const formData = this.formData(form);

        formData.append('username', username);
        return await this.request('users/testFileUpload', formData, 'post');

    }

}

/**
 * default token val
 * @const
 */
TigerlillyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbl90ZXN0IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzEyMjUzOTkxfQ.sZrd5AvjQxcSHu1i6H-tMSlP6eo2Pa6g7bRNAvEt5QA";

export default TigerlillyApi;
