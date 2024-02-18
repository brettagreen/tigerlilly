import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TigerlillyApi from './api';
import './css/author.css';
import Link from '@mui/material/Link';

import { ListSubheader, List, ListItemButton, ListItemText, ListItem, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material'

function Author() {
    const { handle } = useParams();
    const [author, setAuthor] = useState(null);
    const [links, setLinks]  = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchAuthor() {
            let res = await TigerlillyApi.getAuthor(handle);
            setAuthor(res.authors);
            res = await TigerlillyApi.getAuthorArticles(handle);
            setLinks(res.articles);
        }
        fetchAuthor();
    }, [handle]);
 
    return (<>
        {author?
            <>
            <h1 id="authorHeader">Hey! Let's give it up for the one and only {author.author}!</h1>
            <blockquote id="authorSlogan">
                "{author.authorSlogan}"
            </blockquote>
            <div style={{display: 'block', width: '100%'}}>
                <div style={{float: 'left', width: '30%'}}>
                    <List sx={{ float: 'left', width: '80%'}} aria-labelledby="nested-list-subheader">
                        <ListItemButton sx={{maxWidth: '120px'}} onClick={() => setOpen(!open)}>
                            <ListItemText primary="Author articles" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            {links ? links.map((link, idx) => {
                                return(
                                    <> 
                                        <ListItem key={idx}>
                                            <Link href={`/articles/${link.id}`} underline='hover' color='inherit'>{link.articleTitle}</Link>
                                            <Link href={`/issues/${link.issueId}`} underline='hover' color='inherit'>{link.issueTitle}</Link>
                                        </ListItem>
                                    </>
                                )
                            }) : null}
                        </Collapse>
                    </List>
                </div>
                <div style={{float: 'right', width: '70%'}}>
                    <div style={{float: 'right', margin: '10px'}}>
                        {author ? 
                            <div>
                                <img src={`/icons/${author.icon}`} width={250} height={250} alt="author icon"/>
                                <caption id="authorCaption">{`${author.author} aka ${author.authorHandle}`}</caption>
                            </div>
                        : null}
                    </div>
                    <div>
                        <p>
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