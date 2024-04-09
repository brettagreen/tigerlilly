import { render, fireEvent, screen, prettyDOM } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import About from '../components/About';
import Admin from '../components/Admin';
import App from '../components/App';
import Article from '../components/Article';
import ArticlePreview from '../components/ArticlePreview';
import Author from '../components/Author';
import ContactUs from '../components/ContactUs';
import Footer from '../components/Footer';
import React from 'react';

test('About', async function() {
    const { asFragment, findByText } = render(
        <About />
    );
    expect(await findByText("We're 'about' excellence in journalism. Any other questions?")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
});

// test('renders Admin component', function() {
//   const {asFragment} = render(
//     <MemoryRouter initialEntries={[`/admin`]}>
//         <Routes>
//             <Route path="/admin" element={<Admin />} />
//         </Routes>
//     </MemoryRouter>
//   )
//   expect(asFragment()).toMatchSnapshot();
// });

test('App', async function() {
    const { findByAltText, findByRole, asFragment } = render(
        <App />
    );
    expect(await findByAltText('medium social')).toBeInTheDocument();
    const fbr = await findByRole('article');
    console.log('FIND BY ROLE', fbr);
    expect(fbr).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
});

test('Article, /articles/:id', async function() {
    const id = '1';
    const {findByText, findByTestId, asFragment} = render(
        <MemoryRouter initialEntries={[`/articles/${id}`]}>
            <Routes>
                <Route path="/articles/:id" element={<Article passedArticle={null} issueArticle={false} />} />
            </Routes>
        </MemoryRouter>
    );

    expect(await findByText('Jon Johnson')).toBeInTheDocument();
    expect(await findByTestId("testArticle")).toHaveTextContent('gobble gobble!');
    expect(asFragment()).toMatchSnapshot();
});

test('Article, w/ props and long text', async function() {
    const text = 'one two three four five six seven eight nine ten one two three four five six seven eight nine ten ' +
        'one two three four five six seven eight nine ten one two three four five six seven eight nine ten one two three four five ' +
        'six seven eight nine ten one two three four five six seven eight nine ten one two three four five six seven eight nine ten';
    const article = {articleId:1, articleTitle:'boy howdy what a day', text:text, authorFirst:'Bo',
                        authorLast:'Brand', authorHandle:'go fly a kite!'};
    article.expand = true;

    const {findByText, findByTestId, asFragment} = render(
        <Article passedArticle={article} issueArticle={false} />
    );

    expect(await findByTestId("preExpansion")).toHaveTextContent(
        'one two three four five six seven eight nine ten...read more'
    );

    fireEvent.click(await findByText('read more'));

    expect(await findByTestId("postExpansion")).toHaveTextContent(text);
    expect(asFragment()).toMatchSnapshot();

});

test('ArticlePreview', async function() {
    const keyword = 'funny';
    const {findByText, asFragment} = render(
        <MemoryRouter initialEntries={[`/articleKeywords/${keyword}`]}>
            <Routes>
                <Route path="/articleKeywords/:keyword" element={<ArticlePreview />} />
            </Routes>
        </MemoryRouter>
    );
    expect(await findByText("Articles matching #funny")).toBeInTheDocument();
    expect(await findByText("First test article")).toHaveClass("articleTitle");
    expect(asFragment()).toMatchSnapshot();

});

test('renders Author component', async function() {
    const handle = 'thejohnsonator';
    const {asFragment} = render(
        <MemoryRouter initialEntries={[`/author/${handle}`]}>
            <Routes>
                <Route path="/author/:handle" element={<Author />} />
                <Route path="/articles/:id" element={<Article />} />
            </Routes>
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    
    console.log('BUTTON ROLE', await screen.findByRole('button'));
    // expect(await screen.findByText('issues:')).toBeInTheDocument();
    // fireEvent.click(await screen.findByTestId('issuesOpen'));
    // expect(await screen.findByText('First test article')).toBeInTheDocument();
    // let el = await screen.findByText('First test article');
    // console.log(prettyDOM(el));
    //fireEvent.click(el);
    //console.log(prettyDOM(document.body));
    //expect(await screen.findByTestId("paramsArticle")).toHaveTextContent('gobble gobble!');

});

test('renders ContactUs component', async function() {
    const {asFragment} = render(
        <MemoryRouter initialEntries={['/contact']}>
            <Routes>
                <Route path="/contact" element={<ContactUs />} />
            </Routes>
        </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
});

test('renders Footer component', function() {
    const {asFragment} = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
});
