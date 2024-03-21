//typedefs
/**
 * @typedef {Object} author - author object 
 * @property {number=} authorId
 * @property {string=authorFirst+' '+authorLast} author
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string} authorHandle
 * @property {string} authorBio
 * @property {string} icon
 * @property {string} authorSlogan
 *
*/
/**
 * @typedef {Object} article - Article object
 * @property {number=} articleId 
 * @property {string} articleTitle
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string=} authorHandle
 * @property {number=} authorId
 * @property {string} text
 * @property {string} issueTitle
 * @property {number=} issueId
 * @property {Date=} pubDate
 *
*/

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from '../api';
import '../css/author.css';

import { Link, List, ListItemButton, ListItemText, ListItem, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

/**
 * @component /frontend/src/components/Author
 * @requires module:react.useEffect
 * @requires module:react.useState
 * @requires module:react-router-dom.useParams
 * @requires module:/frontend/src/api
 * @requires module:mui/material/Link
 * @requires module:mui/material/List
 * @requires module:mui/material/ListItemButton
 * @requires module:mui/material/ListItemText
 * @requires module:mui/material/ListItem
 * @requires module:mui/material/Collapse
 * @requires module:mui/icons-material/ExpandLess
 * @requires module:mui/icons-material/ExpandMore
 * 
 * @description Author component. presents Author information along with list of articles that the author has written.
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} - contains author info and related author page info/layout
 *
 */
function Author() {
    /**
     * @typedef {Object} handleParam - key:val object containing any all url passed params
     * @property {string} handle - url passed param
     */
    /**
     * @type {handleParam}
     */
    const { handle } = useParams();

     /**
     * @typedef {Object} controlAuthor - useState hook. author object and assign author object
     * @property {author} author - author object
     * @property {function} setAuthor - sets value of the author object
     */
    /**
     * @type {controlAuthor}
     */
    const [author, setAuthor] = useState(null);

     /**
     * @typedef {Object} controlLinks - useState hook. author's articles and set author's articles
     * @property {[article]} links - array of article objects
     * @property {function} setLinks - sets array of article objects
     */
    /**
     * @type {controlLinks}
     */
    const [links, setLinks]  = useState(null);

     /**
     * @typedef {Object} controlPrimaryOpen - useState hook. opens/closes left-hand facing author articles list
     * @property {boolean} primaryOpen - whether menu is open or closed 
     * @property {function} setPrimaryOpen - sets whether menu is open or closed
     */
    /**
     * @type {controlPrimaryOpen}
     */
    const [primaryOpen, setPrimaryOpen] = useState(false);

     /**
     * @typedef {Object} controlUniqueIssues - useState hook. array of unique issues assoc with author's articles
     * @property {[string]} uniqueIssues - array of unique values among all article objects as a combo of link.issueTitle+' '+link.pubDate
     * @property {function} setUniqueIssues - sets value of uniqueIssues array
     */
    /**
     * @type {controlUniqueIssues}
     */
    const [uniqueIssues, setUniqueIssues] = useState(null);

     /**
     * @typedef {Object} controlIssuesMap - useState hook. controlUniqueIssues values put to a map object as keys w/ initial values set to false
     * @property {[{uniqueIssue: false}]} issuesMap - array of unique values among all article objects as a combo of link.issueTitle+' '+link.pubDate
     * @property {function} setIssuesMap - sets value of issuesMAp
     */
    /**
     * @type {controlIssuesMap}
     */
    const [issuesMap, setIssuesMap] = useState({});

    useEffect(() => {
        console.log('useEffect() Author');

        /**
         * fetches author info and all articles that author has written.
         * from returned articles, extracts unique issues as identified by issueTitle+' '+pubDate combo.
         * sets these values as uniqueIssues. these values are in turn made keys in the issuesMap object
         * @async
         * @returns {undefined}
         */
        async function fetchAndFilter() {
            let res = await TigerlillyApi.getAuthor(handle);
            setAuthor(res.authors);

            res = await TigerlillyApi.getAuthorArticles(handle);
            let cutoff;
            const articleArray = [];
            for (let article of res.articles) {
                cutoff = (article.pubDate).indexOf('T');
                article.pubDate = (article.pubDate).substring(0, cutoff);
                articleArray.push(article);
            }

            setLinks(articleArray);
        
            const filter = new Set();
            for (let link of articleArray) {
                filter.add(link.issueTitle+' '+link.pubDate);
            }

            const tempArray = Array.from(filter);
            setUniqueIssues(tempArray);

            const tempMap = {};
            for (let item of tempArray) {
                tempMap[item] = false;
            }

            setIssuesMap(tempMap);
        }

        fetchAndFilter()
    }, [handle]);

    /**
     * set issuesMap = {val: true} or {val: false} based on current existing value
     * this in turn opens or closes that unique issue's sub menu (of articles)
     * @param {string} val 
     * @returns {undefined}
     */
    function setIssuesOpen(val) {
        const tempMap = {...issuesMap};
        tempMap[val] = !tempMap[val];
        setIssuesMap(tempMap);
    }
 
    return (<>
        {author?
            <>
                <div className="PageHeader">
                    <h1 id="authorHeader">Hey! Let's give it up for the one and only {author.author}!</h1>
                        <blockquote id="authorSlogan">
                            "{author.authorSlogan}"
                        </blockquote>
                </div>
                <div className="BackdropWrapper" style={{display: 'block', width: '100%', marginBottom: '.8em', textAlign:'center'}}>
                    <div style={{float: 'left', width: '30%'}}>
                        <List sx={{ float: 'left', width: '80%'}} aria-labelledby="nested-list-subheader">
                            <ListItemButton key={'posbutton'} sx={{minWidth: '120px'}} disableRipple={true} focusRipple={false}
                                    onClick={() => setPrimaryOpen(!primaryOpen)}>
                                <ListItemText sx={{maxWidth: '120px', fontWeight: 'bold'}} key={'ptun'}
                                        primary="Author articles" />
                                {primaryOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>

                            <Collapse in={primaryOpen} timeout="auto" unmountOnExit>
                            {uniqueIssues? <span style={{paddingLeft: '2em', fontStyle: 'italic'}}>issues:</span>:null}
                            {uniqueIssues? uniqueIssues.map((uniqueIssue, idx) => {
                                return(<>
                                    <ListItemButton key={idx} sx={{minWidth: '120px', paddingLeft: '2em'}} disableRipple={true} focusRipple={false}
                                            onClick={() => setIssuesOpen(uniqueIssue)}>
                                        <ListItemText sx={{maxWidth: '120px'}} key={idx} primary={uniqueIssue} />
                                        {issuesMap[uniqueIssue] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>

                                    <Collapse key={'howabouthere?'+idx} in={issuesMap[uniqueIssue]} timeout="auto" unmountOnExit>
                                        {links? links.filter((link) => {
                                            return link.issueTitle+' '+link.pubDate === uniqueIssue;
                                        }).map((filteredlink, idx) => {
                                            return(
                                                <ListItem key={idx} sx={{paddingLeft: '2em'}}>
                                                    <Link href={`/articles/${filteredlink.articleId}`} underline='hover' color='inherit'>
                                                        {filteredlink.articleTitle}
                                                    </Link>
                                                </ListItem>                                      
                                            )
                                        }):null}
                                    </Collapse>
                                </>)
                            }):null}
    
                            </Collapse>
                        </List>
                    </div>

                    <div style={{float: 'right', width: '70%'}}>
                        <div style={{float: 'right', margin: '10px', marginTop: '16px'}}>
                            <figure style={{margin: '7px'}}>
                                <img src={`/icons/${author.icon}`} width={250} height={250} alt="author icon"/>
                                <figcaption id="authorCaption">{`${author.author} aka ${author.authorHandle}`}</figcaption>
                            </figure>
                        </div>
                        <div>
                            <p style={{textAlign: 'left'}}>
                                {author.authorBio}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        :null}</>
    );

}

export default Author;