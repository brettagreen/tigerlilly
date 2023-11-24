import TigerlillyApi from "./api";
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip'

/**
 * modularize,
 * comment on code,
 * post results of any query; exception/success/etc,
 * write tests,
 * error handling
 */

function Admin({ isAdmin }) {
    const history = useNavigate();

    const [category, setCategory] = useState(null);
    const [method, setMethod] = useState(null);
    const [form, setForm] = useState(null);
    const [editValues, setEditValues] = useState(null);
    const [filterValues, setFilterValues] = useState(null);
    const [editObjectId, setEditObjectId] = useState(null);
    const [authorObjects, setAuthorObjects] = useState(null);
    const [issueObjects, setIssueObjects] = useState(null);
    const [userObjects, setUserObjects] = useState(null);
    const [articleObjects, setArticleObjects] = useState(null);
    const [keywordObjects, setKeywordObjects] = useState(null);
    const [keywordEditValues, setKeywordEditValues] = useState(null);
    const [result, setResult] = useState(null);

    const methodBox = useRef();
    const commentFilterBox = useRef();
    const filterItems = useRef();
    const editDelete = useRef();
    const entryForm = useRef();

    const linkArray = ['articleTitle', 'username', 'authorHandle', 'issueTitle', 'id'];

    useEffect(() => {
        console.log('useEffect() history');
        function allowed() {
            if (!isAdmin) {
                history('/unauthorizedAdmin');
            }
        }
        allowed();
    }, [isAdmin, history]);

    function fixCategory(event) {
        console.log('fixCategory()');
        if (category) {
            setResult(null);
            setMethod(null);
            setForm(null);
            setEditValues(null);
            setFilterValues(null);
            setEditObjectId(null);
            setAuthorObjects(null);
            setIssueObjects(null);
            setUserObjects(null);
            setArticleObjects(null);
            setKeywordObjects(null);
            setKeywordEditValues(null);
            methodBox.current.value = "";
            methodBox.current.hidden = true;
            commentFilterBox.current.value = "";
            commentFilterBox.current.hidden = true;
            filterItems.current.value = "";
            filterItems.current.hidden = true;
            editDelete.current.value = "";
            editDelete.current.hidden = true;
            if (form) {
                entryForm.current.hidden = true;
            }
        }
        setCategory(event.target.value);
        methodBox.current.hidden = false;
    }

    function addForm(selectVals) {
        console.log('addForm()');

        const fields = Admin.defaultProps[category].fields;
        let newForm = {};

        for (let x = 0; x < fields.length; x++) {
            if (fields[x].type === 'option') {
                if (fields[x].field === 'authorId' || fields[x].field === 'userId') {
                    newForm[fields[x].field] = selectVals[0];
                } else {
                    newForm[fields[x].field] = selectVals[1];
                }

            } else if (fields[x].field === 'isAdmin') {
                newForm['isAdmin'] = false;
            } else {
                newForm[fields[x].field] = ''; 
            }
        }

        return newForm;
    }

    function selectItem(event) {
        console.log('selectItem()');

        let newForm = {};

        if (category !== 'keywords' && category !== 'updateKeywords') {
            const fields = Admin.defaultProps[category].fields;
            const targetId = Number(event.target.value);

            const obj = editValues.find(val => {
                return val.id === targetId;
            });
    
            setEditObjectId(obj.id);

            for (let x = 0; x < fields.length; x++) {
                newForm[fields[x].field] = obj[fields[x].field];
            }

        } else {
            const num = Number(event.target.value);
            setEditObjectId(num);
            const finalKeywordsObjects = [];

            if (num === 0) {
                const dupes = new Set();
                keywordEditValues.forEach(val => {
                    if (!dupes.has(val.keyword)) {
                        finalKeywordsObjects.push({"keyword": val.keyword});
                        dupes.add(val.keyword)
                    }
                });
            } else {
                keywordEditValues.forEach(val => {
                    if (val.articleId === num) {
                        finalKeywordsObjects.push({"keyword": val.keyword});
                    }
                });                
            }

            console.log('finalKeywordsObjects', finalKeywordsObjects);
            setKeywordObjects(finalKeywordsObjects);

            newForm['articleId'] = 0;
            newForm['keyword'] = finalKeywordsObjects[0].keyword;
            if (method !== 'delete') {
                newForm['edit'] = '';
            }
            setCategory('updateKeywords');
        }
        
        setForm(newForm);
    }

    //this is probably the hackiest part of the app
    //formatting data field values per instance.
    function editDeleteForm(editValues, isFilter, type="") {
        console.log('edits()');
        console.log('CHECK editValues', editValues);
        let att1;
        let att2;
        let att3;
        const maxLength = 20;

        if (isFilter) {
            if (type === 'articles') {
                att1 = 'text';
                att2 = 'articleTitle';
                type = 'articles';
            } else {
                att1 = 'userFirst';
                att2 = 'userLast';
                att3 = [att1, att2]; 
                type = 'users'
            }
        } else {
            if (category === 'issues') {
                att1 = 'issueTitle';
                att2 = 'issueTitle';
            } else if (category === 'articles') {
                att1 = 'text';
                att2 = 'articleTitle';
                att3 = [att2, 'issueTitle']
            } else if (category === 'authors') {
                att1 = 'authorFirst';
                att2 = 'authorLast';
                att3 = [att1, att2];
            } else if (category === 'users') {
                att1 = 'userFirst';
                att2 = 'userLast';
                att3 = [att1, att2]; 
            } else if (category === 'comments') {
                att1 = 'username';
                att2 = 'postDate';
                att3 = [att1, att2];
            } else { //category === 'keywords'
                att1 = 'articleTitle';
                att2 = 'articleTitle';
            }
        }
        
        if (category === 'keywords' || category === 'updateKeywords') {
            setKeywordEditValues(editValues);

            const articleSet = new Set();
            const filteredArticles = editValues.filter(val => {
                if (!articleSet.has(val.articleId)) {
                    val.id = val.articleId;
                    articleSet.add(val.articleId);
                    return val;
                } else {
                    return false;
                }
            });

            filteredArticles.unshift({"id": 0, "articleTitle": "All Articles"});

            editValues = filteredArticles;
        }

        for (let value of editValues) {

            value.display1 = value[att1];

            if (att3) {
                if (value[att3[0]].length > maxLength) {
                    value.display2 = value[att3[0]].slice(0, maxLength - 3) + '... ' + value[att3[1]];
                } else {
                    if (type === 'users' || category === 'users') {
                        value.display2 = value[att3[0]] + ' ' + value[att3[1]];
                    } else {
                        value.display2 = value[att3[0]] + ' ' + value[att3[1]];
                    }
                }
            } else if (att2) {
                if (value[att2].length > maxLength) {
                    value.display2 = value[att2].slice(0,  maxLength - 3) + '...';
                } else {
                    value.display2 = value[att2];
                }
            }

            if (type) {
                value.type = type;
            }
        }

        isFilter ? setFilterValues(editValues) : setEditValues(editValues);
        
    }

    function handleChange(event) {
        console.log('handleChange()');

        if (!isNaN(event.target.value) && event.target.value !== '') {
            setForm({...form, [event.target.name]: Number(event.target.value)});
        } else if (event.target.name === 'isAdmin') {
            setForm({...form, [event.target.name]: event.target.checked});
        }  else if (typeof event.target.value === 'string') {
            setForm({...form, [event.target.name]: event.target.value});
        }  else {
            setForm({...form, [event.target.name]: ''});
        }

    }

    async function submitAndClear(event) {
        console.log('submitAndClear()');
        event.preventDefault();

        let objectId;

        //category === 'keywords' i.e. not 'updateKeywords'
        if (form['keywords']) {
            form['keywords'] = form['keywords'].split(' ');
        }

        if (category === 'updateKeywords') {
            if (method === 'edit') {
                delete form['articleId'];
                objectId = editObjectId;
            } else {
                objectId = `${editObjectId+'/'+form['keyword']}`
            }

        } else {
            objectId = editObjectId;
        }

        let response;
        const methodDictionary = {"add": "post", "edit": "patch", "delete": "delete"};

        console.log('submitted form', form);

        if (method === 'delete') {
            response = await TigerlillyApi.commit(category === 'updateKeywords' ? 'keywords' : category, null, methodDictionary[method], objectId);
        } else if (method === 'edit') {
            response = await TigerlillyApi.commit(category === 'updateKeywords' ? 'keywords' : category, form, methodDictionary[method], objectId);
        } else {
            response = await TigerlillyApi.commit(category, form, methodDictionary[method]);
        }

        console.log('successful response', response);

        if (!(category === 'users' && method === 'add')) {
            setResult([Array.from(Object.keys(response[category])), Array.from(Object.values(response[category]))]);
        }
        setForm(null);
        setEditValues(null);
        setFilterValues(null);
        setEditObjectId(null);
        setAuthorObjects(null);
        setIssueObjects(null);
        setUserObjects(null);
        setArticleObjects(null);
        setKeywordObjects(null);
        setKeywordEditValues(null);
        methodBox.current.value = "";
        editDelete.current.value = "";
        editDelete.current.hidden = true;
        entryForm.current.hidden = true;
        commentFilterBox.current.value = "";
        commentFilterBox.current.hidden = true;
        filterItems.current.value = "";
        filterItems.current.hidden = true;

     }

    async function assignSelectObjects() {
        console.log('assignSelectObjects()')

        if (category === 'articles') {
            const authorItemArray = [];
            const issueItemArray = [];
            const authors = await TigerlillyApi.get('authors');
            const issues = await TigerlillyApi.get('issues');

            for (let item of authors['authors']) {
                authorItemArray.push({"authorId": item.id, "authorFirst": item.authorFirst, "authorLast": item.authorLast});
            }
    
            for (let item of issues['issues']) {
                issueItemArray.push({"issueId": item.id, "issueTitle": item.issueTitle});
            }
    
            setAuthorObjects(authorItemArray);
            setIssueObjects(issueItemArray);
    
            return [authorItemArray[0].authorId, issueItemArray[0].issueId];

        } else {

            const userItemArray = [];
            const articleItemArray = [];
            const articles = await TigerlillyApi.get('articles');

            for (let item of articles['articles']) {
                articleItemArray.push({"articleId": item.id, "articleTitle": item.articleTitle});
            }
            if (category === 'keywords' || category === 'updateKeywords') {
                articleItemArray.unshift({"articleId": 0, "articleTitle": "All Articles"});
            }

            setArticleObjects(articleItemArray);

            if (category === 'comments') {
                const users = await TigerlillyApi.get('users');
                for (let item of users['users']) {
                    userItemArray.push({"userId": item.id, "username": item.username});
                }
                setUserObjects(userItemArray);
                return [userItemArray[0].userId, articleItemArray[0].articleId];
            } else {
                return [null, articleItemArray[0].articleId];
            }

        }
    }

    async function fixMethod(event) {
        console.log('fixMethod()');

        setResult(null);

        if (method) {
            if (event.target.value === 'add') {
                editDelete.current.value = "";
                editDelete.current.hidden = true;
            }
            setForm(null);
        }

        const tempMethod = event.target.value;
        let initialSelectVals;

        if (['articles', 'comments', 'keywords', 'updateKeywords'].includes(category)) {
           initialSelectVals = await assignSelectObjects();
        }
        

        if (tempMethod === 'add') {
            setForm(addForm(initialSelectVals));
        } else {
            if (category === 'comments') {
                commentFilterBox.current.hidden = false;
            } else {
                const cat = category==='updateKeywords'?'keywords':category;
                const resp = await TigerlillyApi.get(cat);
                editDeleteForm(resp[cat], false);
                editDelete.current.hidden = false;
            }
        }

        setMethod(tempMethod);
    }

    async function fixFilter(event) {
        console.log('fixFilter()');
        let resp;

        if (event.target.value === 'articles') {
            resp = await TigerlillyApi.get('articles');
        } else {    
            resp = await TigerlillyApi.get('users');
        }

        editDeleteForm(resp[event.target.value], true, event.target.value);
        filterItems.current.hidden = false;
    }

    async function selectFilterItem(event) {
        console.log('selectFilterItem()');
        const [id, filterType] = (event.target.value).split(',');

        const resp = await TigerlillyApi.getComments(Number(id), filterType);

        editDeleteForm(resp[category], false);
        editDelete.current.hidden = false;
    }

    useEffect(() => {
        if (form) {
            entryForm.current.hidden = false;
        }
    }, [form]);

    useEffect(() => {
        if (!result) {
            setMethod(null);
        }
    }, [result]);

    function createURL(key, val) {
        const link = <Link to={`/${category}/${key}/${val}`}>{val}</Link>
        console.log('link', link);
        return <td>{link}</td>
    }

    return (
        <div>
            <div className="selectOptions">
                <select name="type" onChange={fixCategory}>
                    <option value="">--Select one of the following--</option>
                    <option value="issues">Issues</option>
                    <option value="articles">Articles</option>
                    <option value="authors">Authors</option>
                    <option value="users">Users</option>
                    <option value="comments">Comments</option>
                    <option value="keywords">Article keywords</option>
                </select>
                <select hidden ref={methodBox} onChange={fixMethod}>
                    <option value="">--Select type of operation--</option>
                    <option value="add">Add</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                </select>
                <select hidden ref={commentFilterBox} onChange={fixFilter}>
                    <option value="">--Filter By: --</option>
                    <option value="articles">Article</option>
                    <option value="users">User</option>
                </select>
                <select hidden ref={filterItems} onChange={selectFilterItem}>
                    <option value="">--Select object to filter by--</option>
                    {filterValues ? filterValues.map((val, idx) => {
                        return (<Tooltip disableFocusListener key={idx+1} title={val.display1}>
                            <option key={-idx-1} value={[val.id, val.type]}>{val.display2}</option>
                                </Tooltip>)
                    }) : null}
                </select>
                <select hidden ref={editDelete} onChange={selectItem}>
                    <option value="">--Select object to {method === 'delete'? 'delete': 'modify'}--</option>
                    {editValues ? editValues.map((val, idx) => {
                        return (<Tooltip disableFocusListener key={idx+1} title={val.display1}>
                            <option key={-idx-1} value={val.id}>{val.display2}</option>
                                </Tooltip>)
                    }) : null}
                </select>
            </div>
            {form ? 
                <form hidden ref={entryForm} id="adminForm" onSubmit={submitAndClear}>
                    {Admin.defaultProps[category].fields.map((field, idx) => {
                        console.log('form category', category)
                        if ((method === 'delete' || method === 'edit') && field.field === 'password') {
                            return null;
                        }
                        const disabled = method === 'delete' ? true : false;
                        return (<>
                            <label key={idx+1} htmlFor={field.field}>{field.field}</label>
                            {field.type === 'textarea' ? 
                                <textarea key={-idx-1} id={field.field} type={field.type} name={field.field} value={form[field.field]}
                                        disabled={disabled} onChange={handleChange} /> :
                            null}

                            {field.type !== 'option' && field.type !== 'textarea' ?
                                <input checked={form[field.field]} key={-idx-1} id={field.field} type={field.type} name={field.field} value={form[field.field]}
                                disabled={disabled} onChange={handleChange} /> :
                            null}

                            {field.type === 'option' && field.field === 'authorId' ?
                                <select value={form[field.field]} name={field.field} disabled={disabled} onChange={handleChange}>
                                    {authorObjects.map((obj) => {
                                        return <option type="number" value={obj.authorId}>{obj.authorId} - {obj.authorFirst} {obj.authorLast}</option>
                                    })}
                                </select> :
                            null}

                            {field.type === 'option' && field.field === 'issueId' ?
                                <select value={form[field.field]} name={field.field} disabled={disabled} onChange={handleChange}>
                                    {issueObjects.map((obj) => {
                                        return <option type="number" value={obj.issueId}>{obj.issueId} - {obj.issueTitle}</option>
                                    })}
                                </select> :
                            null}                        

                            {field.type === 'option' && field.field === 'articleId' ?
                                <select value={form[field.field]} name={field.field} disabled={false} onChange={handleChange}>
                                    {articleObjects.map((obj) => {
                                        return <option type="number" value={obj.articleId}>{obj.articleId} - {obj.articleTitle}</option>
                                    })}
                                </select> :
                            null}

                            {field.type === 'option' && field.field === 'userId' ?
                                <select value={form[field.field]} name={field.field} disabled={disabled} onChange={handleChange}>
                                    {userObjects.map((obj) => {
                                        return <option type="number" value={obj.userId}>{obj.userId} - {obj.username}</option>
                                    })}
                                </select> :
                            null}

                            {field.type === 'option' && field.field === 'keyword' ?
                                <select value={form[field.field]} name={field.field} disabled={false} onChange={handleChange}>
                                    {keywordObjects.map((obj) => {
                                        return <option type="text" value={obj.keyword}>{obj.keyword}</option>
                                    })}
                                </select> :
                            null}

                            <br />
                        </>)
                    })}
                <button>{method === 'delete' ? "Delete" : "Submit"}</button>
            </form> : null}
            {result && !(category === 'users' && method === 'add') ?
                <table>
                    <thead>
                        <tr>
                            <th colSpan={result[1][1] === undefined?result[1].length:result[1][1].length+1}>
                            {method==='add'?'ADDED':method==='edit'?'UPDATED':'DELETED'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {result[0].map(val => {
                                let tds;
                                if (val === 'keywords') {
                                    tds = [];
                                    let count = 0;
                                    while (count < result[1][1].length) {
                                        count++;
                                        tds.push(<td>keyword</td>);
                                    }
                                }
                                return val==='keywords'?tds:<td>{val}</td>
                            })
                            }
                        </tr>
                        <tr>
                            {result[1].map(val => {
                                console.log('val', val);
                                let tds;
                                const typeOf = typeof val;
                                if (typeOf === 'object') {
                                    console.log('object val', val);
                                    tds = [];
                                    for (let x=0; x<val.length;x++) {
                                            tds.push(<td>{val[x]}</td>)
                                    }
                                } else {
                                    for (let x=0; x<val.length;x++) {
                                        console.log('column', result[1][1][x]);
                                        console.log('value', val[x]);
                                        if (linkArray.includes(result[1][1][x])) {
                                            tds.push(createURL(result[1][1][x], val[x]));
                                        } else {
                                            tds.push(<td>{val[x]}</td>)
                                        }
                                    }
                                }
                                return typeOf==='object'?tds:<td>{val}</td>
                            })
                            }
                        </tr>
                    </tbody>
                </table>
            : null}
        </div>
    )
}


Admin.defaultProps = {
    issues: {
        fields: [
             {
                field: 'issueTitle', 
                type: 'text'
             },
             {
                field: 'pubDate',
                type: 'datetime-local'
             }
        ]
    },
    articles: {
        fields: [
            {
                field: 'articleTitle',
                type: 'text'
            },
            {
                field: 'authorId',
                type: 'option'
            },
            {
                field: 'text',
                type: 'textarea'
            },
            {
                field: 'issueId',
                type: 'option'
            }   
        ]
    },
    authors: {
        fields: [
            {
                field: 'authorFirst',
                type: 'text'
            },
            {
                field: 'authorLast',
                type: 'text'
            },
            {
                field: 'authorHandle',
                type: 'text'
            },
            {
                field: 'authorBio',
                type: 'textarea'
            },
            {
                field: 'icon',
                type: 'url'
            }
        ]
    },
    users: {
        fields: [
            {
                field: 'userFirst',
                type: 'text'
            },
            {
                field: 'userLast',
                type: 'text'
            },
            {
                field: 'email',
                type: 'email'
            },
            {
                field: 'username',
                type: 'text'
            },
            {
                field: 'password',
                type: 'password'
            },
            {
                field: 'isAdmin',
                type: 'checkbox'
            },
            {
                field: 'icon',
                type: 'url'
            }
        ]
    },
    comments: {
        fields: [
            {
                field: 'userId',
                type: 'option'
            },
            {
                field: 'text',
                type: 'textarea'
            },
            {
                field: 'articleId',
                type: 'option'
            },
            {
                field: 'postDate',
                type: 'datetime-local'
            }
        ]
    },
    keywords: {
        fields: [
            {
                field: 'articleId',
                type: 'option'
            },
            {
                field: 'keywords',
                type: 'textarea'
            }
        ]
    },
    updateKeywords: {
        fields: [
            {
                field: 'keyword',
                type: 'option'
            },
            {
                field: 'edit',
                type: 'text'
            }
        ]
    }

};

export default Admin;