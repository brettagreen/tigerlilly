import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TigerlillyApi from './api';
import { Link } from 'react-router-dom';

import { ListSubheader, List, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material'

function Author() {
    const { handle } = useParams();
    const [author, setAuthor] = useState(null);
    const [links, setLinks]  = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchAuthor() {
            let res = await TigerlillyApi.getAuthor(handle);
            setAuthor(res['authors']);
            res = await TigerlillyApi.getAuthorArticles(handle);
            setLinks(res['articles']);
        }
        fetchAuthor();
    }, [handle]);

    const handleClick = () => {
      setOpen(!open);
    };

    return (
        <div>
            {author ? 
                <div>
                    <img src={`/icons/${author.icon}`} width={250} height={250} alt="author icon"/>
                    <h2>name: {author.authorFirst + ' ' + author.authorLast}</h2>
                    <h3>handle: {author.authorHandle}</h3>
                    <h4>bio: {author.authorBio}</h4> 
                </div>
            : null}
            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Articles by author
                    </ListSubheader>
                }
            >      
                <ListItemButton onClick={handleClick}>
                    <ListItemText primary="Articles" />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {links ? links.map(link => {
                            return(
                                <>
                                    <Link exact="true" to={`/articles/${link.id}`}>{link.articleTitle}</Link>
                                    <h6>as seen in </h6><Link exact="true" to={`/issues/${link.issueId}`}>{link.issueTitle}</Link>
                                </>
                            )
                        }) : null}
                    </List>
                </Collapse>
            </List>
        </div>
    )

}

export default Author;