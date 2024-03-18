import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import TigerlillyApi from '../api';
import '../css/author.css';

import { List, ListItemButton, ListItemText, ListItem, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function Author() {
    const { handle } = useParams();
    const [author, setAuthor] = useState(null);
    const [links, setLinks]  = useState(null);
    const [primaryOpen, setPrimaryOpen] = useState(false);
    const [uniqueIssues, setUniqueIssues] = useState(null);
    const [issuesMap, setIssuesMap] = useState({});

    useEffect(() => {
        console.log('useEffect() Author');

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
                                            console.log('filteredlink', filteredlink);
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