import { gridTheme } from './css/styles';
import { ThemeProvider } from '@emotion/react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Article from './Article';

function SearchResults({ search }) {

    const [searchString, searchArray, parsedResults] = search;
    const history = useNavigate();

    function previousPage() {
        setTimeout(() => {
            history(-1);
        }, 3000);
    }

    if (parsedResults.length > 0) {
        return (
            <> 
                <ThemeProvider theme={gridTheme}>
                    <h2>Articles matching search '{searchString}'</h2>
                    <Grid id="daGrid" container rowSpacing={2} columnSpacing={{xs:2, sm:3, md:4}} columns={{xs:2, sm:3, md:4}}>

                        {parsedResults.map((article, idx) => {
                            if ((article.text).split(' ').length >= 50) {
                                article.expand = true;
                            } else {
                                article.expand = false;
                            }
                            return ( 
                                <Grid key={idx} item xs={1} sm={1} md={1}>
                                    <Article passedArticle={article} issueArticle={false} searchString={searchString}
                                        searchArray={searchArray}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                </ThemeProvider>
            </>
        )
    } else {
        previousPage();
        return <h1>nothing matching {searchString}. Try again!!!</h1>
    }
}

export default SearchResults;