import Grid from '@mui/material/Grid';
import Article from './Article';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from './api';

function Issue() {
    const [issue, setIssue] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchIssue() {
            console.log('id', id);
            let resp;
            if (id) {
                resp = await TigerlillyApi.getIssue(id);
            } else {
                resp = await TigerlillyApi.getCurrentIssue();
            }
            console.log('resp', resp);
            setIssue(resp.issues);
        }
		fetchIssue();
    }, [id]);
    
    if (issue) {
        return (
            <>
                <h1>{issue[0].issueTitle}</h1>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    {issue.map((art, idx) => {
                        return <Grid key={idx} item xs={1} sm={2} md={3}><Article title={art.articleTitle} author={art.authorHandle} text={art.text}/></Grid>
                    })}
                </Grid>
            </>
        );
    }

}

export default Issue;