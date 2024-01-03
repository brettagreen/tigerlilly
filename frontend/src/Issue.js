import './css/issue.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Article from './Article';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from './api';

function Issue() {
    const [issue, setIssue] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchIssue() {
            let resp;
            if (id) {
                resp = await TigerlillyApi.getIssue(id);
            } else {
                resp = await TigerlillyApi.getCurrentIssue();
            }
            setIssue(resp.issues);
        }
		fetchIssue();
    }, [id]);
    
    if (issue) {
        return (
            <Box Box className="Box" component="main">
                <h1>{issue[0].issueTitle}</h1>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {issue.map((article, idx) => {
                        return( 
                        <Grid key={idx} item xs={1} sm={2} md={3}>
                            <Article passedArticle={article}/>
                        </Grid>)
                    })}
                </Grid>
            </Box>
        );
    }

}

export default Issue;