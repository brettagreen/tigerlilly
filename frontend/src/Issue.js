import './css/issue.css';
import Grid from '@mui/material/Grid';
import Article from './Article';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TigerlillyApi from './api';
import { ThemeProvider } from '@emotion/react';
import { gridTheme } from './css/styles';

function Issue() {
    const [issue, setIssue] = useState(null);
    const { id } = useParams();
    const VIEW_WIDTH = document.documentElement.clientWidth;

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

    function gridItemClass(idx) {
        let columns;

        if (VIEW_WIDTH > 900) {
            columns = 4;
            if (idx % columns === 0 || idx % columns === 3) {
                if (issue.length - idx <= 4) {
                    return 'noBorders'
                } else {
                    return 'bottomBorder';
                }
            } else {
                if (issue.length - idx <= 4) {
                    return 'sideBorders'
                } else {
                    return 'sideBorders bottomBorder';
                }
            }
        } else if (VIEW_WIDTH > 600) {
            columns = 3;
            if (idx % columns === 0 || idx % columns === 2) {
                if (issue.length - idx <= 3) {
                    return 'noBorders'
                } else {
                    return 'bottomBorder';
                }
            } else {
                if (issue.length - idx <= 3) {
                    return 'sideBorders'
                } else {
                    return 'sideBorders bottomBorder';
                }
            }
        } else {
            columns = 2;
            if (idx % columns === 0) {
                if (issue.length - idx <= 2) {
                    return 'rightBorder'
                } else {
                    return 'rightBorder bottomBorder';
                }
            } else {
                if (issue.length - idx <= 2) {
                    return 'noBorders'
                } else {
                    return 'bottomBorder';
                }
            }
        }
    }

    function createGrid() {
        return(<>
            {/* <span id="borderTopLeft" className="gridFrame">&#111;</span>
            <span id="borderTopRight" className="gridFrame">&#111;</span> */}
            <Grid id="daGrid" container rowSpacing={2} columnSpacing={{xs:2, sm:3, md:4}} columns={{xs:2, sm:3, md:4}}>
                {issue.map((article, idx) => {
                    return( 
                        <Grid className={gridItemClass(idx)} key={idx} item xs={1} sm={1} md={1}>
                            <Article passedArticle={article} issueArticle={true}/>
                        </Grid>
                    )
                })}
            </Grid>
            {/* <span id="borderBottomLeft" className="gridFrame">&#111;</span>
            <span id="borderBottomRight" className="gridFrame">&#111;</span> */}
        </>)
    }
    
    if (issue) {
        return (
            <>
                <ThemeProvider theme={gridTheme}>
                    <header>
                        <img id="masthead" src="/images/masthead.jpg" alt="masthead"/>
                    </header>
                    <h1 id="issueTitle">{issue[0].issueTitle}</h1>
                    <div style={{display: 'block'}}>
                        {createGrid()}
                    </div>
                    {/* <footer>
                        <img id="footer" src="/images/footer.jpg" alt="footer" />
                    </footer> */}
                </ThemeProvider>
            </>
        );
    }

}

export default Issue;