import { useEffect, useState, useRef, useContext } from 'react';
//import { useParams, Link } from 'react-router-dom';
import { Link, TextField, ThemeProvider } from '@mui/material';
import UserContext from './userContext';
import TigerlillyApi from './api';
import { textareaTheme } from './css/styles';
import './css/article.css';

function Article({ passedArticle }) {

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState(null);
    const [keywords, setKeywords] = useState(null)
    const [showComments, setShowComments] = useState('show comments');
    const user = useContext(UserContext).user;

    const [commentForm, setCommentForm] = useState({userId: user ? user.id : 0, text: '', articleId: passedArticle.articleId});
    //const { id } = useParams();
    const showLeaveComment = useRef();
    const showCommentsRef = useRef();

    async function handleCommentSubmission(event) {
        event.preventDefault();
        showLeaveComment.current.hidden = true;
        console.log('user', user);
        console.log('commentForm', commentForm);
        const resp = await TigerlillyApi.commit('comments', commentForm, 'post');
        setComments([...comments].unshift(resp.comments));
        setCommentForm({...commentForm, 'text': ''});
    }

    function handleChange(event) {
        if (!isNaN(event.target.value) && event.target.value !== '') {
            setCommentForm({...commentForm, [event.target.name]: Number(event.target.value)});
        } else {
            setCommentForm({...commentForm, [event.target.name]: event.target.value});
        }
    }

    async function fetchComments(id) {
        console.log('fetchComments() useEffect')
        const resp = await TigerlillyApi.getComments(id, 'articles');

        if (resp.comments.length !== 0) {
            setComments(resp.comments);
        }
    }

    async function fetchKeywords(id) {
        console.log('fetchKeywords() useEffect');
        const resp = await TigerlillyApi.getArticleKeywords(id);

        setKeywords(resp.keywords);
    }

    function toggleComments() {
        if (showCommentsRef.current.hidden) {
            showCommentsRef.current.hidden = false;
            setShowComments('hide comments');
        } else {
            showCommentsRef.current.hidden = true;
            setShowComments('show comments');
        }
    }

    useEffect(() => {
        async function setUp() {
            setArticle(passedArticle);
            await fetchComments(passedArticle.articleId);
            await fetchKeywords(passedArticle.articleId);
        }
        setUp();
    }, [passedArticle]);

    return (
        <>
            {article ?
                <article>
                    <div>
                        <h2 id="articleTitle">{article.articleTitle}</h2>
                        {!article.authorHandle?<h4 style={{color: 'rgba(0, 0, 0, 0.87)'}}>by anonymous</h4>:<h4 style={{color: 'rgba(0, 0, 0, 0.87)'}}>by {<Link underline='none' href={`/author/${article.authorHandle}`}>
                            {article.authorFirst + ' ' + article.authorLast}</Link>}</h4>}
                        <p className="articleText">{article.text}</p>
                    </div>
                    <div>
                        <Link href="#" component="button" underline='always' onClick={() => { if (showLeaveComment.current.hidden) 
                                showLeaveComment.current.hidden = false 
                                else showLeaveComment.current.hidden = true}}>leave a comment
                        </Link>
                        &nbsp;&nbsp;
                        {comments !== null ?
                            <Link href="#" component="button" underline='always' onClick={toggleComments}>{showComments}</Link>
                        :null}
                    </div>
                </article>
            :null
            }
            <div hidden ref={showLeaveComment}>
                <form onSubmit={handleCommentSubmission}>
                    <ThemeProvider theme={textareaTheme}>
                        <TextField type="textarea" name="text" value={commentForm['text']}
                                    multiline minRows={5} onChange={handleChange} sx={{height: 'inherit'}} />
                    </ThemeProvider>
                        <br />
                        <Link href="#" sx={{float: 'left'}} onClick={() => showLeaveComment.current.hidden = true} 
                                type="button" component="button" underline="none">cancel</Link>
                        <Link href="#" sx={{float: 'right'}} component="button" type="submit" underline="none">submit</Link>
                </form>
            </div> 
            <br />
            {keywords ?
                <div>
                    {keywords.map((keyword, idx) => {
                        return(<Link key={-idx -1} sx={{display: "inline-block", fontSize: "x-small"}} 
                                    href={`/articleKeywords/${keyword['keyword']}`} underline="hover">
                                #{keyword['keyword']}&nbsp;
                            </Link>)
                        })
                    }
                </div>
            :null
            }
            <br />
            <div hidden ref={showCommentsRef}>
                {comments ? 
                    comments.map((comment, idx) => {
                        return(
                            <div key={idx+1}>
                                <h6>{<Link href={`/user/${comment['username']}`}>{comment['username']}</Link>}&nbsp;
                                    {new Date(comment['postDate']).toLocaleString()}
                                </h6>
                                <img src={`/icons/${comment['icon']}`} width={100} height={100} alt="user icon"/>
                                <p id="commentText">{comment['text']}</p>
                                <hr id="commentHR"></hr>
                            </div>
                        )
                    })
                :null   
                }
            </div>
        </>
    )
}

export default Article;