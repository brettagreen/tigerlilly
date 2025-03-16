import '../css/admin.css';
import TigerlillyApi from "../api";
import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Box, Button, Checkbox, FormControl, FormHelperText,
            InputLabel, MenuItem, Modal, Select, TextField, ThemeProvider } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { formTheme, textareaTheme } from '../css/styles';
import UserContext from '../userContext';

function Admin() {
    const history = useNavigate();

    //db environment
    const [environment, setEnvironment] = useState('tigerlilly_test');

    //filter/search related variables
    const [category, setCategory] = useState('');
    const [method, setMethod] = useState('');
    const [filterVal, setFilterVal] = useState('');
    const [commentObject, setCommentObject] = useState('');
    const [selectedObject, setSelectedObject] = useState('');

    const [showMethodBox, setMethodBox] = useState(false)
    const [showCommentFilterBox, setCommentFilterBox] = useState(false);
    const [showFilterItems, setFilterItems] = useState(false);
    const [showEditDelete, setEditDelete] = useState(false);
    const entryForm = useRef();
    const hiddenFileInput = useRef();

    const [articles, setArticles] = useState(null);
    const [authors, setAuthors] = useState(null);
    const [issues, setIssues] = useState(null);
    const [keywords, setKeywords] = useState(null);
    const [users, setUsers] = useState(null);

    //submit form variables
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

    const [modalOpen, setModalOpen] = useState(true);
    const setTables = {"articles": setArticles, "authors": setAuthors, "issues": setIssues,
                        "keywords": setKeywords, "users": setUsers};

    //result related
    const linkArray = ['articleTitle', 'username', 'authorHandle', 'issueTitle'];

    const isAdmin = useContext(UserContext).user.isAdmin;

    //useEffect() stuff
    
    //default to tigerlilly_test db, return to default .env db environment setting on page exit
    useEffect(() => {
        console.log('setEnv() useEffect');
        async function setEnv() {
            console.log('am i getting here?');
            let resp = await TigerlillyApi.setEnvironment(environment);
            console.log("big kahuna", resp);
        }
    
        setEnv();

        return async () => {
            await TigerlillyApi.setEnvironment(null);
        }
        
    }, [environment]);

    //fetch table data up front on page load. reload if/when table has been updated (see submitAndClear function below)
    //wasn't able to get useMemo to work. it's my understanding that it doesn't play well with async code
    //so this is the best version of operational caching that I could come up with.
    useEffect(() => {
        console.log('allowed() and loadTables() useEffect');

        async function loadTables() {
            let resp;

            resp = await TigerlillyApi.get('articles');
            setArticles(resp.articles);

            resp = await TigerlillyApi.get('authors');
            setAuthors(resp.authors);

            resp = await TigerlillyApi.get('issues');
            setIssues(resp.issues);

            resp = await TigerlillyApi.get('keywords');
            setKeywords(resp.keywords);

            resp = await TigerlillyApi.get('users');
            setUsers(resp.users);
        }
    
        function allowed() {
            if (!isAdmin) {
                history('/unauthorized/notAdmin');
            } else {
                loadTables();
            }
        }
        
	    console.log('environment value', environment);
        allowed();
        
    }, [environment, history, isAdmin]);

    
    useEffect(() => {
        console.log('form() useEffect');
        if (form) {
            entryForm.current.hidden = false;
        }
    }, [form]);


    useEffect(() => {
        console.log('result() useEffect');
        if (!result) {
            setMethod('');
        }
    }, [result]);


    async function fixEnvironment(event) {
	console.log("e.t.v.", event.target.value);
        const resp = await TigerlillyApi.setEnvironment(event.target.value);
	console.log('RESPect', resp);
	setEnvironment(event.target.value);
    }

    function fixCategory(event) {
        console.log('fixCategory()');
        setMethod('');
        setFilterVal('');
        setCommentObject('');
        setSelectedObject('');

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
        setMethodBox(false);
        setCommentFilterBox(false);
        setFilterItems(false);
        setEditDelete(false);

        setResult(null);
        setModalOpen(true);

        if (form) {
            entryForm.current.hidden = true;
        }
        setCategory(event.target.value);
        setMethodBox(true);
    }

    async function fixMethod(event) {
        console.log('fixMethod()');

        setResult(null);

        if (method) {
            if (event.target.value === 'add') {
                setEditDelete(false);
            }
            setForm(null);
        }

        const tempMethod = event.target.value;

        if (['articles', 'comments', 'keywords', 'updateKeywords'].includes(category)) {
           await assignSelectObjects();
        }
        
        if (tempMethod === 'add') {
            setForm(addForm());
        } else {
            if (category === 'comments') {
                setCommentFilterBox(true)
            } else {
                let cat;
                if (category === 'articles') {
                    cat = articles;
                } else if (category === 'authors') {
                    cat = authors;
                } else if (category === 'issues') {
                    cat = issues;
                } else if (category === 'keywords' || category === 'updateKeywords') {
                    if (selectedObject) {
                        setSelectedObject('');
                    }
                    cat = keywords;
                } else { //users
                    cat = users;
                }
                editDeleteForm(cat, false);
                setEditDelete(true);
            }
        }

        setMethod(tempMethod);
    }

    async function fixFilter(event) {
        console.log('fixFilter()');

        setFilterVal(event.target.value);

        //users or articles
        const resp = await TigerlillyApi.getObjectsWithComments(event.target.value);
        
        editDeleteForm(resp[event.target.value], true, event.target.value);
        setFilterItems(true);
    }

    function addForm() {
        console.log('addForm()');

        const fields = Admin.defaultProps[category].fields;
        let newForm = {};

        for (let x = 0; x < fields.length; x++) {

            if (fields[x].field === 'isAdmin') {
                newForm['isAdmin'] = false;
            } else if (fields[x].field === 'icon') {
                newForm['icon'] = null;
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

            console.log('event', event);
            const val = event.target.value;
            console.log("selectItem() val", val);
            const targetId = Number(val.id);
            setSelectedObject(val);

            const obj = editValues.find(val => {
                return val.id === targetId;
            });
            
            setEditObjectId(obj.id);

            for (let x = 0; x < fields.length; x++) {
                newForm[fields[x].field] = obj[fields[x].field];
            }

            //get that pesky 'Z' on the timestamp trimmed off
            if (newForm['postDate']) {
                newForm['postDate'] = obj['postDate'].substring(0, obj['postDate'].length -1);
            }

            if (newForm.hasOwnProperty('password')) {
                delete newForm['password'];
	    }


        } else {
            const num = Number(event.target.value.articleId);
            setEditObjectId(num);
            setSelectedObject(event.target.value);

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

            setKeywordObjects(finalKeywordsObjects);

            newForm['articleId'] = 0;
            newForm['keyword'] = finalKeywordsObjects[0]['keyword'];

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
        
        let att1;
        let att2;
        let att3;
        let att4;
        let quotes1;
        let quotes2;
        const maxLength = 30;

        if (isFilter) {
            if (type === 'articles') {
                att1 = 'articleTitle';
                quotes1 = true;
                att2 = 'text';
                quotes2 = true;
                att3 = [att1, att2];
                type = 'articles';
            } else {
                att1 = 'userFirst';
                quotes1 = false;
                att2 = 'userLast';
                quotes2 = false;
                att3 = [att1, att2]; 
                type = 'users'
            }
        } else {
            if (category === 'issues') {
                att1 = 'issueTitle';
                quotes1 = true;
                att2 = 'issueTitle';
                quotes2 = false;
            } else if (category === 'articles') {
                att1 = 'text';
                quotes1 = true
                att2 = 'articleTitle';
                quotes2 = false
                att3 = [att2, 'issueTitle']
                att4 = 'no issue';
            } else if (category === 'authors') {
                att1 = 'authorFirst';
                quotes1 = false
                att2 = 'authorLast';
                quotes2 = false;
                att3 = [att1, att2];
            } else if (category === 'users') {
                att1 = 'userFirst';
                quotes1 = false;
                att2 = 'userLast';
                quotes2 = false;
                att3 = [att1, att2]; 
            } else if (category === 'keywords' || category === 'updateKeywords') { 
                att1 = 'articleTitle';
                quotes1 = false;
                att2 = 'articleTitle';
                quotes2 = false;
            } else { //comments
                att1 = 'username';
                quotes1 = false;
                att2 = 'text';
                quotes2 = false;
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

            filteredArticles.unshift({"articleId": 0, "articleTitle": "All Articles"});

            editValues = filteredArticles;
        }

        for (let value of editValues) {

            value.display1 = value[att1];

            if (att3) {
                let val1;
                let val2;

                if (value[att3[1]]) {
                    if (quotes2) {
                        val2 = '"'+value[att3[1]]+'"';
                    } else {
                        val2 = value[att3[1]];
                    }

                } else {
                    val2 = att4;
                }

                if (quotes1) {
                    if (value[att3[0]].length > maxLength) {
                        val1 = '"'+value[att3[0]].slice(0, maxLength)+'..."';
                    } else {
                        val1 = '"'+value[att3[0]]+'"';
                    }
                } else {
                    if (value[att3[0]].length > maxLength) {
                        val1 = value[att3[0]].slice(0, maxLength)+'...';
                    } else {
                        val1 = value[att3[0]];
                    }
                }

                value.display2 = val1 + ' ' + val2;

            } else if (att2) {
                if (quotes2) {
                    if (value[att2].length > maxLength) {
                        value.display2 = '"'+value[att3[0]].slice(0, maxLength)+'..."';
                    } else {
                        value.display2 = '"'+value[att2]+'"';
                    }
                } else {
                    if (value[att2].length > maxLength) {
                        value.display2 = value[att2].slice(0,  maxLength - 3)+'...';
                    } else {
                        value.display2 = value[att2];
                    }
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

        } else if (event.target.name === 'icon') {
            if (event.target.files[0].size > 3000000) {
                return(
                <Alert variant="filled" severity="warning">
                    Please choose a file 3MB or smaller.
                </Alert>
                )
            } else {
                setForm({...form, [event.target.name]: event.target.files[0]});
            }

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
            response = await TigerlillyApi.commit(category === 'updateKeywords' ? 'keywords' :
                         category, null, methodDictionary[method], objectId);
        } else if (method === 'edit') {
            response = await TigerlillyApi.commit(category === 'updateKeywords' ? 'keywords' :
                         category, form, methodDictionary[method], objectId);
        } else {
            response = await TigerlillyApi.commit(category, form, methodDictionary[method]);
        }

        //trigger reload/fetch of whatever table has been updated just above
        //wasn't able to get useMemo to work. it's my understanding that it doesn't play well with async code
        //so this is the best version of operational caching that I could come up with.
        const cat = category==='updateKeywords'?'keywords':category;
        const subResponse = await TigerlillyApi.get(cat);
        setTables[cat](subResponse[cat]);

        if (!(category === 'users' && method === 'add')) {
            setResult([Array.from(Object.keys(response[category])), Array.from(Object.values(response[category]))]);
        }

        setFilterVal('');
        setCommentObject('');
        setSelectedObject('');
        
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
        setMethodBox(false);
        setEditDelete(false);
        setCommentFilterBox(false);
        setFilterItems(false);

        setCategory('');
        entryForm.current.hidden = true;

    }

    async function assignSelectObjects() {
        console.log('assignSelectObjects()')

        if (category === 'articles') {
            const authorItemArray = [];
            const issueItemArray = [];

            for (let item of authors) {
                authorItemArray.push({"authorId": item.id, "authorFirst": item.authorFirst, "authorLast": item.authorLast});
            }
    
            for (let item of issues) {
                issueItemArray.push({"issueId": item.id, "issueTitle": item.issueTitle});
            }
            
            setAuthorObjects(authorItemArray);
            setIssueObjects(issueItemArray);
    
            return [authorItemArray[0].authorId, issueItemArray[0].issueId];

        } else {

            const userItemArray = [];
            const articleItemArray = [];

            for (let item of articles) {
                articleItemArray.push({"articleId": item.id, "articleTitle": item.articleTitle});
            }
            if (category === 'keywords' || category === 'updateKeywords') {
                articleItemArray.unshift({"articleId": 0, "articleTitle": "All Articles"});
            }

            setArticleObjects(articleItemArray);

            if (category === 'comments') {
                for (let item of users) {
                    userItemArray.push({"userId": item.id, "username": item.username});
                }
                setUserObjects(userItemArray);
            }
        }
    }

    async function selectFilteredComments(event) {
        console.log('selectFilterItem()');
        const val = event.target.value;
        
        const id = val.id;
        const filterType = val.type;

        const resp = await TigerlillyApi.getComments(Number(id), filterType);

        editDeleteForm(resp[category], false);
        setEditDelete(true);

        setCommentObject(val);
    }

    function handleFileClick() {
        hiddenFileInput.current.click();
    };

    function returnChangeTable() {
        const handleClose = () => setModalOpen(false);

        //shamelessly 'stolen' css from https://mui.com
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '99%',
            bgcolor: '#f3f2f2',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
        };

        return(
            <div>
                <Modal open={modalOpen} onClose={handleClose}>
                    <Box sx={style}>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell key="whocares" sx={{textAlign: "center"}}colSpan={!result[1][1]?result[1].length:result[1][1].length+1}>
                                    {method==='add'?'ADDED':method==='edit'?'UPDATED':<span id="th">DELETED</span>}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                {result[0].map((val, idx) => {
                                    let tds;
                                    if (val === 'keywords') {
                                        tds = [];
                                        let count = 0;
                                        while (count < result[1][1].length) {
                                            count++;
                                            tds.push(<TableCell key={idx}>keyword</TableCell>);
                                        }
                                    }
                                    return val==='keywords'?tds:<TableCell key={idx}>{val}</TableCell>
                                })
                                }
                            </TableRow>
                            <TableRow>
                                {result[1].map((val,idx) => {
                                    let tds;

                                    if (!val && typeof val !== 'boolean') val = 'null';

                                    const typeOf = typeof val;

                                    if (typeOf === 'object') {
                                        tds = [];
                                        for (let x=0; x<val.length;x++) {
                                            tds.push(<TableCell key={idx}>{val[x]}</TableCell>);
                                        }
                                    } else {
                                        if (linkArray.includes(result[0][idx]) && 
                                            !(method === 'delete' && idx === 0) &&
                                            val !== 'All Articles' && val!=='null') {

                                            val = <Link key={-idx} to={`/${category}/${result[0][idx]}/${val}`}>{val}</Link>
                                        }
                                    }
                                    return typeOf==='object'?tds:<TableCell key={idx}>{val}</TableCell>
                                })
                                }
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Button onClick={handleClose}>close</Button>
                </Box>
            </Modal>
        </div>
        )
    }

    return (
        <ThemeProvider theme={formTheme}>
            <main id="adminMain">
                <Box className="AdminBackdrop" component="section">
                    <FormControl margin="normal" className="FormControl">
                        <InputLabel id="cat">--Select DB to work with. Default is 'test'--</InputLabel>
                        <Select className="Select" component="select" labelId="cat" onChange={fixEnvironment} value={environment}>
                            <MenuItem key="production" className="MenuItem" value="tigerlilly">production</MenuItem>
                            <MenuItem key="test" className="MenuItem" value="tigerlilly_test">test</MenuItem>
                            <MenuItem key="testing" className="MenuItem" value="tigerlilly_testing">testing</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl margin="normal" className="FormControl">
                        <InputLabel id="cat">--Select one of the following--</InputLabel>
                        <Select className="Select" component="select" labelId="cat" name="type" onChange={fixCategory} 
                                value={category==='updateKeywords'?'keywords':category}>
                            <MenuItem key="issues" className="MenuItem" value="issues">Issues</MenuItem>
                            <MenuItem key="articles" className="MenuItem" value="articles">Articles</MenuItem>
                            <MenuItem key="authors" className="MenuItem" value="authors">Authors</MenuItem>
                            <MenuItem key="users" className="MenuItem" value="users">Users</MenuItem>
                            <MenuItem key="comments" className="MenuItem" value="comments">Comments</MenuItem>
                            <MenuItem key="keywords" className="MenuItem" value="keywords">Article keywords</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl margin="normal" className="FormControl" sx={{display: showMethodBox? undefined: 'none'}}>
                        <InputLabel id="meth">--Select type of operation--</InputLabel>
                        <Select className="Select" component="select" labelId="meth" onChange={fixMethod} value={method}>
                            <MenuItem key="add" className="MenuItem" value="add">Add</MenuItem>
                            <MenuItem key="edit" className="MenuItem" value="edit">Edit</MenuItem>
                            <MenuItem key="delete" className="MenuItem" value="delete">Delete</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl margin="normal" className="FormControl" sx={{display: showCommentFilterBox? undefined: 'none'}}>
                        <InputLabel id="filterby">--Filter By: --</InputLabel>
                        <Select className="Select" component="select" labelId="filterby" onChange={fixFilter} value={filterVal}>
                            <MenuItem key="filterArticles" className="MenuItem" value="articles">Article</MenuItem>
                            <MenuItem key="filterUsers" className="MenuItem" value="users">User</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl margin="normal" className="FormControl" sx={{display: showFilterItems? undefined: 'none'}}>
                        <InputLabel id="objectfilter">--Select object to filter by--</InputLabel>
                        <Select className="Select" component="select" labelId="objectfilter" 
                                    onChange={selectFilteredComments} value={commentObject}>
                            {filterValues ? filterValues.map((val, idx) => {
                                return (//<Tooltip disableFocusListener key={idx+1} title={val.display1}>
                                            <MenuItem key={-idx-1} className="MenuItem" value={val}>{val.display2}</MenuItem>
                                        //</Tooltip>
                                        );
                            }) : null}
                        </Select>
                    </FormControl>
                    <FormControl margin="normal" className="FormControl" sx={{display: showEditDelete? undefined: 'none'}}>
                        <InputLabel id="finalboss">--Select {category==='keywords'||category==='updateKeywords' ?
                                            'Article to filter by' : category.substring(0,category.length-1)}
                                            {category!=='keywords'&&category!=='updateKeywords' ? method === 'delete'?
                                            'to delete': 'to modify':null}--
                        </InputLabel>
                        <Select className="Select" component="select" labelId="finalboss" onChange={selectItem} value={selectedObject}>
                            {editValues ? editValues.map((val, idx) => {
                                return (//<Tooltip key={idx+1} title={val.display1}>
                                            <MenuItem key={-idx-1} className="MenuItem" value={val}>{val.display2}</MenuItem>
                                        //</Tooltip>
                                        )
                            }) : null}
                        </Select>
                    </FormControl>
                </Box>
                {form ?
                <>
                <hr id="adminHR" />
                <Box className="AdminBackdrop" component="section">
                    <div hidden ref={entryForm}>
                        <form id="adminForm" autoComplete="off" encType="multipart/form-data" onSubmit={submitAndClear}> 
                            {Admin.defaultProps[category].fields.map((field, idx) => {
                                if ((method === 'delete' || method === 'edit') && field.field === 'password') {
                                    return null;
                                }
                                const disabled = method === 'delete' ? true : false;
                                return (<>
                                    <FormControl margin="normal" className="FormControl">
                                        {['text','email','password'].includes(field.type) ?
                                            <TextField key={-idx-1} type={field.type} name={field.field} value={form[field.field]}
                                                    label={field.field} disabled={disabled} onChange={handleChange} /> :
                                        null}

                                        {field.type === 'textarea' ?
                                            <ThemeProvider theme={textareaTheme}>
                                                <TextField key={-idx-1} type={field.field} name={field.field} value={form[field.field]}
                                                        multiline minRows={5} label={field.field} disabled={disabled} onChange={handleChange}
                                                />
                                            </ThemeProvider> :
                                        null}

                                        {field.type ==='checkbox' ?
                                        <>
                                            <InputLabel id={idx+field.field} shrink={false}>{field.field}</InputLabel>
                                            
                                            <Checkbox checked={form[field.field]} key={-idx-1} type={field.type} name={field.field} value={form[field.field]}
                                                        disableRipple={true} disabled={disabled} onChange={handleChange} 
                                                        sx={{position: 'inherit', ml: '1em', mt: '1em', width: '202px'}}/>   
                                        </> :
                                        null}

                                        {field.type ==='file' ?
                                            <>
                                                <div style={{display: 'block'}}>
                                                    <Button type="button" variant="outlined" onClick={handleFileClick}
                                                            sx={{ display: 'inline-block', maxWidth: '10em', backgroundColor: '#f3f2f2', fontSize: '.6em',
                                                            color: '#171515', borderColor: '#171515', marginTop: '1em', fontVariant: 'small-caps'}}
                                                    >Select icon</Button>
                                                    <span style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: '0.5em'}}>{form.icon?form.icon.name:"no file selected"}</span>

                                                    <TextField className="HiddenField" key={-idx-1} type={field.type} name={field.field} variant="standard" onChange={handleChange}
                                                                inputRef={hiddenFileInput} 
                                                    />
                                                </div>
                                            </> :
                                        null}

                                        {field.type ==='datetime-local' ?
                                            <>
                                                <TextField key={-idx-1} type={field.type} name={field.field} variant="standard"
                                                         value={form[field.field]} disabled={disabled} onChange={handleChange} />
                                            </> :
                                        null}

                                        {field.field === 'authorId' ?
                                            <>  
                                                <InputLabel id={idx+field.field}>{field.field}</InputLabel>
                                                <Select className="Select" component="select" value={form[field.field]} name={field.field} disabled={disabled} 
                                                            labelId={idx+field.field} onChange={handleChange}>
                                                    <MenuItem key={-1} className="MenuItem" value=''> </MenuItem>
                                                    {authorObjects.map((obj, idx) => {
                                                        return <MenuItem key={idx} className="MenuItem" type="number" value={obj.authorId}>{obj.authorId} - {obj.authorFirst} {obj.authorLast}</MenuItem>
                                                    })}
                                                </Select>
                                            </> :
                                        null}

                                        {field.field === 'issueId' ?
                                            <>
                                                <InputLabel id={idx+field.field}>{field.field}</InputLabel>
                                                <Select className="Select" component="select" value={form[field.field]} name={field.field} disabled={disabled} 
                                                            labelId={idx+field.field} onChange={handleChange}>
                                                    <MenuItem key={-1} className="MenuItem" value=''> </MenuItem>
                                                    {issueObjects.map((obj, idx) => {
                                                        return <MenuItem key={idx} className="MenuItem" type="number" value={obj.issueId}>{obj.issueId} - {obj.issueTitle}</MenuItem>
                                                    })}
                                                </Select>
                                            </> :
                                        null}                        

                                        {field.field === 'articleId' ?
                                            <>
                                                <InputLabel id={idx+field.field}>{field.field}</InputLabel>
                                                <Select className="Select" component="select" value={form[field.field]} name={field.field} disabled={false} 
                                                        labelId={idx+field.field} onChange={handleChange}>
                                                    <MenuItem key={-1} className="MenuItem" value=''> </MenuItem>
                                                    {articleObjects.map((obj, idx) => {
                                                        return <MenuItem key={idx} className="MenuItem" type="number" value={obj.articleId}>{obj.articleId} - {obj.articleTitle}</MenuItem>
                                                    })}
                                                </Select>
                                            </> :
                                        null}

                                        {field.field === 'userId' ?
                                            <>
                                                <InputLabel id={idx+field.field}>{field.field}</InputLabel>
                                                <Select className="Select" component="select" value={form[field.field]} name={field.field} disabled={disabled} 
                                                        labelId={idx+field.field} onChange={handleChange}>
                                                    <MenuItem key={-1} className="MenuItem" value=''> </MenuItem>
                                                    {userObjects.map((obj, idx) => {
                                                        return <MenuItem key={idx} className="MenuItem" type="number" value={obj.userId}>{obj.userId} - {obj.username}</MenuItem>
                                                    })}
                                                </Select>
                                            </> :
                                        null}

                                        {field.field === 'keyword' ?
                                            <>
                                                <InputLabel id={idx+field.field}>{field.field}</InputLabel>
                                                <Select className="Select" component="select" value={form[field.field]} name={field.field} disabled={false} 
                                                        labelId={idx+field.field} onChange={handleChange}>
                                                    {keywordObjects.map((obj, idx) => {
                                                        return <MenuItem key={idx} className="MenuItem" type="text" value={obj.keyword}>{obj.keyword}</MenuItem>
                                                    })}
                                                </Select> 
                                            </>:
                                        null}
                                        {field.optional ?
                                            <FormHelperText>*optional</FormHelperText>
                                        :null}
                                    </FormControl>
                                    <br />
                                </>)
                            })}
                            {method === 'delete' ?
                                <Button type="submit" variant="outlined" sx={{ maxWidth: '10em', backgroundColor: 'red',
                                        color: '#171515', fontSize: '.6em', borderColor: '#171515', marginTop: '2em',
                                        fontVariant: 'small-caps'}}
                                >Delete</Button> :
                                <Button type="submit" variant="outlined" sx={{ maxWidth: '10em', backgroundColor: '#f3f2f2',
                                        color: '#171515', fontSize: '.6em', borderColor: '#171515', marginTop: '2em', fontVariant: 'small-caps'}}
                                >Submit</Button>
                            }
                        </form> 
                    </div>
                </Box></>: null}
                
                {result && !(category === 'users' && method === 'add') ?
                    returnChangeTable()
                : null}
            </main>
        </ThemeProvider>
    )
}


Admin.defaultProps = {
    issues: {
        fields: [
             {
                field: 'issueTitle', 
                type: 'text',
                optional: false
             },
             {
                field: 'pubDate',
                type: 'datetime-local',
                optional: true
             }
        ]
    },
    articles: {
        fields: [
            {
                field: 'articleTitle',
                type: 'text',
                optional: false
            },
            {
                field: 'authorId',
                type: 'option',
                optional: true
            },
            {
                field: 'text',
                type: 'textarea',
                optional: false
            },
            {
                field: 'issueId',
                type: 'option',
                optional: true
            }   
        ]
    },
    authors: {
        fields: [
            {
                field: 'authorFirst',
                type: 'text',
                optional: false
            },
            {
                field: 'authorLast',
                type: 'text',
                optional: false
            },
            {
                field: 'authorHandle',
                type: 'text',
                optional: false
            },
            {
                field: 'authorSlogan',
                type: 'text',
                optional: false
            },
            {
                field: 'authorBio',
                type: 'textarea',
                optional: true
            },
            {
                field: 'icon',
                type: 'file',
                optional: true
            }
        ]
    },
    users: {
        fields: [
            {
                field: 'userFirst',
                type: 'text',
                optional: false
            },
            {
                field: 'userLast',
                type: 'text',
                optional: false
            },
            {
                field: 'email',
                type: 'email',
                optional: false
            },
            {
                field: 'username',
                type: 'text',
                optional: false
            },
            {
                field: 'password',
                type: 'password',
                optional: false
            },
            {
                field: 'isAdmin',
                type: 'checkbox',
                optional: true
            },
            {
                field: 'icon',
                type: 'file',
                optional: true
            }
        ]
    },
    comments: {
        fields: [
            {
                field: 'userId',
                type: 'option',
                optional: false
            },
            {
                field: 'text',
                type: 'textarea',
                optional: false
            },
            {
                field: 'articleId',
                type: 'option',
                optional: false
            },
            {
                field: 'postDate',
                type: 'datetime-local',
                optional: true
            }
        ]
    },
    keywords: {
        fields: [
            {
                field: 'articleId',
                type: 'option',
                optional: false
            },
            {
                field: 'keywords',
                type: 'textarea',
                optional: false
            }
        ]
    },
    updateKeywords: {
        fields: [
            {
                field: 'keyword',
                type: 'option',
                optional: false
            },
            {
                field: 'edit',
                type: 'text',
                optional: false
            }
        ]
    }
};

export default Admin;
