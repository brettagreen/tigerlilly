//typedefs
/**
 * @typedef {Object} author - Author object
 * @property {number} authorId
 * @property {string} authorFirst
 * @property {string} authorLast
 * @property {string} authorLast
 * @property {string} authorHandle
 * @property {string} authorBio
 * @property {string} icon
 * @property {string} authorSlogan
 *
*/
/**
 * @typedef {Object} issue - Issue object
 * @property {number=} issueId
 * @property {string} issueTitle
 * @property {Date} pubDate
 * @property {number=} volume
 * @property {number=} issue
 * @property {number=} articleId
 * @property {string=} articleTitle
 * @property {string=} text
 * @property {string=} authorFirst
 * @property {string=} authorLast
 * @property {string=} authorHandle 
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
/**
 * @typedef {Object} user - returned User object 
 * @property {number} id 
 * @property {string} username
 * @property {string} userFirst
 * @property {string} userLast
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {string} icon
 *
*/
/**
 * @typedef {Object} search - passed [search] values from App component.
 * @property {function} setSearchString - sets the (final) val the user submitted for the search query
 * @property {function} setSearchArray - sets value of final vals to search for
 * @property {function} setSearchResults - sets returned article(s) that matched search query
 * @property {string} searchVal - literal string as presented in the input field
 * @property {function} setSearchVal - sets literal string as presented in the input field
 */

import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../userContext';
import TigerlillyApi from "../api";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import ListSubheader from '@mui/material/ListSubheader';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FormHelperText  from '@mui/material/FormHelperText';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

import { ThemeProvider } from '@mui/material/styles';
import { styled, alpha } from '@mui/material/styles';
import { toolbarMenuTheme, userMenuTheme } from '../css/styles';

/**
 * width in pixels of Drawer components
 * @type {number}
 */
const drawerWidth = 225;

/**
 * MUI styled AppBar component
 * @type {JSX.Element}
 */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
  })  (({ theme, menuOpen }) => ({
  
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(menuOpen && {
            width: `calc(100% - ${drawerWidth}px)`,
            zIndex: theme.zIndex.drawer + 1,

            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

/**
 * css style assets for Drawer components
 * @type {Object}
 */
const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: 'rgba(0,0,0,.85)',
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box'
    }
};

/**
 * css styled div element. for search field
 * @type {JSX.Element}
 */
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    marginRight: '2em',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: '17em'
    },
}));

/**
 * css styled div element. for magnifying glass icon in search field
 * @type {JSX.Element}
 */
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

/**
 * styled MUI InputBase for search field
 * @type {JSX.Element}
 */
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '100%'
        }
    }
}));

/**
 * @component /frontend/src/components/NavigationBar
 * @requires module:react.useEffect
 * @requires module:react.useState
 * @requires moduel:react.useContext
 * @requires module:react.useRef
 * @requires module:react-router-dom.useNavigate
 * @requires module:react-router-dom.useLocation
 * @requires module:/frontend/src/userContext
 * @requires module:/frontend/src/api
 * @requires module:mui/material/Box
 * @requires module:mui/material/Drawer
 * @requires module:mui/material/AppBar
 * @requires module:mui/material/Toolbar
 * @requires module:mui/material/List
 * @requires module:mui/material/Typography
 * @requires module:mui/material/IconButton
 * @requires module:mui/icons-material/Menu
 * @requires module:mui/icons-material/Home
 * @requires module:mui/icons-material/ChevronLeft
 * @requires module:mui/icons-material/ChevronRight
 * @requires module:mui/material/ListItem
 * @requires module:mui/material/ListItemIcon
 * @requires module:mui/material/ListItemText
 * @requires module:mui/material/Link
 * @requires module:mui/material/ListSubheader
 * @requires module:mui/icons-material/Cancel
 * @requires module:mui/material/Tooltip
 * @requires module:mui/material/Avatar
 * @requires module:mui/material/Menu
 * @requires module:mui/material/MenuItem
 * @requires module:mui/material/InputBase
 * @requires module:mui/icons-material/Search
 * @requires module:mui/material/FormHelperText
 * @requires module:mui/material.useScrollTrigger
 * @requires module:mui/material/Slide
 * @requires module:mui/material/styles/ThemeProvider
 * @requires module:mui/material/styles.styled
 * @requires module:mui/material/styles.alpha
 * @requires module:/frontend/src/css/styles.toolbarMenuTheme
 * @requires module:/frontend/src/css/styles.userMenuTheme
 * 
 * @description NavigationBar component. hugs top of page at all times except on home page. on home page it is activated
 * on scrolling down. if user is not logged in, it has links to sign up or log in. if logged in, there will be user 
 * avatar with options to view profile or to log out. regarldess of whether user is logged in, navbar will have a search
 * field for article keyword/phrase searches or #hashtag searches. Also, hamburger menu will trigger opening of side
 * panel that has links to various parts of the site.
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @param {Object} search - { setSearchString, setSearchArray, setSerachResults, searchVal, setSearchVal }
 * @returns {JSX.Element} Box (component) containing the AppBar containing the ToolBar...containing a number of Drawer components
 *
 */
function NavigationBar({ search }) {

    /**@type {search} */
    const [setSearchString, setSearchArray, setSearchResults, searchVal, setSearchVal] = search;

    /**
     * @typedef {Object} controlUserMenu - useState hook. right facing avatar menu open/close functionality
     * @property {boolean} userMenuOpen - menu is open or closed
     * @property {function} setUserMenuOpen - toggles menu open state
     */
    /**
     * @type {controlUserMenu}
     */
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    /**
     * @typedef {Object} controlNavEl - useState hook. helps set position of user menu component relative AppBar
     * @property {number} navEl - position offset
     * @property {function} setNavEl - set position offset
     */
    /**
     * @type {controlNavEl}
     */
    const [navEl, setNavEl] = useState(null);

    /**
     * @typedef {Object} controlMenuOpen - useState hook. left facing hamburger menu functionality. opens/closes top Drawer component
     * @property {boolean} menuOpen - Drawer is open/closed 
     * @property {function} setMenuOpen - toggle Drawer open/closed
     */
    /**
     * @type {controlMenuOpen}
     */
    const [menuOpen, setMenuOpen] = useState(false);

    /**
     * @typedef {Object} controlAuthorsOpen - useState hook. opens/closes Authors menu item subdrawer Drawer component
     * @property {boolean} authorsOpen - Drawer is open/closed 
     * @property {function} setAuthorsOpen - toggle Drawer open/closed
     */
    /**
     * @type {controlAuthorsOpen}
     */
    const [authorsOpen, setAuthorsOpen] = useState(false);

    /**
     * @typedef {Object} controlIssuesOpen - useState hook. opens/closes Issues menu item subdrawer Drawer component
     * @property {boolean} issuesOpen - Drawer is open/closed 
     * @property {function} setIssuesOpen - toggle Drawer open/closed
     */
    /**
     * @type {controlIssuesOpen}
     */
    const [issuesOpen, setIssuesOpen] = useState(false);

    /**
     * @typedef {Object} controlArticlesOpen - useState hook. opens/closes Articles menu item subdrawer Drawer component
     * @property {boolean} articlesOpen - Drawer is open/closed 
     * @property {function} setArticlesOpen - toggle Drawer open/closed
     */
    /**
     * @type {controlArticlesOpen}
     */
    const [articlesOpen, setArticlesOpen] = useState(false);

    /**
     * @typedef {Object} controlMenuIssues - useState hook. populates individual Issue nav items (which is a subdrawer of the Issues subdrawer)
     * @property {[issue]} menuIssues - array of Issue objects
     * @property {function} setMenuIssues - set menuIssues object value
     */
    /**
     * @type {controlMenuIssues}
     */
    const [menuIssues, setMenuIssues] = useState(null);

    /**
     * @typedef {Object} controlMenuAuthors - useState hook. populates individual Author nav items (which is a subdrawer of the Authors subdrawer)
     * @property {[author]} menuAuthors - array of Author objects
     * @property {function} setMenuAuthors - set menuAuthors object value
     */
    /**
     * @type {controlMenuAuthors}
     */
    const [menuAuthors, setMenuAuthors] = useState(null);

    /**
     * @typedef {Object} controlMenuArticles - useState hook. populates individual Article nav items (which is a subdrawer of the Articles subdrawer)
     * @property {[article]} menuArticles - array of Article objects
     * @property {function} setMenuArticles - set menuArticles object value
     */
    /**
     * @type {controlMenuArticles}
     */
    const [menuArticles, setMenuArticles] = useState(null);

    /**
     * get user context object/info
     * @type {user}
     */
    const user = useContext(UserContext).user;

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    /**
     * the useRef is a hook "that lets you reference a value that’s not needed for rendering"
     * @see https://react.dev/reference/react/useRef
     * in this case it's used in the function handleOutsideClick() function to determine if user
     * click event falls w/in returned JSX.Element tree or not
     * @type {Object}
     */
    const menuRef = useRef();

    /**
     * @typedef {Object} controlSearchError - useState hook. Controlls display of text that appears if user's search is invalid
     * @property {boolean} searchError - is there a search error?
     * @property {function} setMenuAuthors - sets value for searchError. default is false.
     */
    /**
     * @type {controlSearchError}
     */
    const [searchError, setSearchError] = useState(false);

    /**
     * naughty search words. will be removed from any keyword search. 
     * won't be removed from hashtag or "phrase" searches
     * @type {string[]}
     */
    const stopwords = [
        'a',    'an',    'and',   'are',
        'as',   'at',    'be',    'but',
        'by',   'for',   'if',    'in',
        'into', 'is',    'it',    'no',
        'not',  'of',    'on',    'or',
        'such', 'that',  'the',   'their',
        'then', 'there', 'these', 'they',
        'this', 'to',    'was',   'will',
        'with'
    ];

    /**
     * used for controlling AppBar behavior. i.e. when appbar shows/hides
     * @name trigger
     * @type {function}
     */
    const trigger = useScrollTrigger({
        disableHysteresis: true
    });

    /**
     * the useLocation object returns current page in app ('/','/login', etc.).
     * @see https://reactrouter.com/en/6.22.3/hooks/use-location
     * we want AppBar behavior to be slightly different for the homepage vs other pages,
     * hence useLocation
     * @type {Object}
     */
    const location = useLocation();

    /**
     * opens right-aligned user menu
     * @returns {undefined}
    */
    function handleOpenUserMenu(event) {
        setUserMenuOpen(!userMenuOpen);

        if (userMenuOpen) {
            setNavEl(event.currentTarget);
        } else {
            setNavEl(null);
        }
    };

    /**
     * closes right-aligned user menu
     * @returns {undefined}
    */
    function handleCloseUserMenu() {
        setUserMenuOpen(false);
        setNavEl(null);
    };  

    /**
     * opens left-aliged menu drawer
     * @returns {undefined}
     */
    function handleMenuOpen() {
        setMenuOpen(true);
    }
    /**
     * closes initial menu drawer and opens authors drawer
     * @returns {undefined}
     */
    function handleAuthorsOpen() {
        setMenuOpen(false);
        setAuthorsOpen(true);
    }

    /**
     * closes initial menu drawer and opens issues drawer
     * @returns {undefined}
     */
    function handleIssuesOpen() {
        setMenuOpen(false);
        setIssuesOpen(true);
    }

    /**
     * retrieves all articles that are associated with the issue object that has the id param.
     * then closes the issues drawer and opens the articles drawer
     * @async
     * @param {number} id
     * @returns {undefined}
     */
    async function handleArticlesOpen(id) {
        setArticlesOpen(true);
        setIssuesOpen(false);

        const resp = await TigerlillyApi.getIssue(id);
        setMenuArticles(resp.issues);
    }

    /**
     * closes author drawer and opens initial menu drawer
     * @returns {undefined}
     */
    function handleAuthorsClose() {
        setMenuOpen(true);
        setAuthorsOpen(false);
    }

    /**
     * closes the articles drawer and opens the issues drawer
     * @returns {undefined}
     */
    function handleArticlesClose() {
        setIssuesOpen(true);
        setArticlesOpen(false);
    }

    /**
     * closes issues drawer and opens initial menu drawer
     * @returns {undefined}
     */
    function handleIssuesClose() {
        setIssuesOpen(false);
        setMenuOpen(true);
    }

    /**
     * controlled input for search field string value
     * @param {Object} event 
     * @returns {undefined}
     */
    function handleSearchInput(event) {
        setSearchVal(event.target.value);
    }

    /**
     * massage search input before submitting to the backend to perform actual search
     * repace '#' hashes with neutral '*'.
     * replace all ',' w/ ' '
     * /"[^"]+"|[^\s]+/g regEx captures all individual words/hashtags AND phrases per " ".
     * these values are then filtered to ensure they don't contain any of the 'stopwords'
     * yippeeee yay, now we can trim() what we've got and submitted to the backed. godspeed!
     * user then sent to the /searchResults page to view results of their search.
     * @async
     * @param {Object} event
     * @return {undefined}
     */
    async function performSearch(event) {
        event.preventDefault();
        if (searchVal.length > 3) {
            let tempSearchVal = searchVal.replaceAll('#', '*'); //hashes don't travel well in http header requests

            if (tempSearchVal.includes(',')) {
                tempSearchVal = tempSearchVal.replaceAll(',', ' ');
            }

            let finalSearchVal = tempSearchVal.match(/"[^"]+"|[^\s]+/g).filter((val) => {
                return !stopwords.includes(val);
            });
            
            finalSearchVal = finalSearchVal.map((val) => {
                return val.trim();
            });

            const res = await TigerlillyApi.search(finalSearchVal);

            //these values are set in App.js
            setSearchString(searchVal);
            setSearchArray(finalSearchVal);
            setSearchResults(res.results);
            

            history('/searchResults');
            setSearchVal('');
        } else {
            setSearchVal('');
            setSearchError(true);
        }
    }

    /**
     * global 'click' event handler
     * if click event falls anywhere within the NavigationBar component, then nothing happens.
     * otherwise, any open menu drawers are closed === same as closing menu drawers voluntarily
     * @global
     * @param {Object} event
     * @returns {undefined}
     */
    function handleOutsideClick(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
            setAuthorsOpen(false);
            setIssuesOpen(false);
            setArticlesOpen(false);
        }
    }

    useEffect(() => {

        /**
         * ties handleOutsideClick() function to global document object
         */
        document.addEventListener('click', handleOutsideClick);

        /**
         * upon initial page render, load menu Drawer components with (all) Author and Issue objects
         * @async
         * @returns {undefined}
         */
        async function loadTables() {
            let resp;

            resp = await TigerlillyApi.get('authors');
            setMenuAuthors(resp.authors);

            resp = await TigerlillyApi.get('issues');
            setMenuIssues(resp.issues);

        }

        loadTables();
    }, []);
    

    return (
        <Box ref={menuRef} sx={{marginBottom: '70px', fontFamily: 'Roboto'}}>
            <ThemeProvider theme={toolbarMenuTheme}>
                <Slide appear={false} direction={location.pathname==='/'?"down":null} in={location.pathname==='/'?trigger:true}>
                    <AppBar position="fixed" sx={{backgroundColor: 'rgba(0,0,0,.85)', width: '100%'}}>
                        <Toolbar>
                        <Typography sx={{ flexGrow: 1 }}>
                            <IconButton color="inherit" onClick={handleMenuOpen} edge="start" disableRipple={true} sx={{marginRight: '.83em'}}>
                                <MenuIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => history('/')} disableRipple={true}>
                                <HomeIcon />
                            </IconButton>
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <form onSubmit={performSearch}>
                                <StyledInputBase
                                    sx={{fontSize: 'small'}}
                                    onChange={handleSearchInput}
                                    placeholder='keywords, "phrase", or #hashtags'
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchVal}
                                />
                            </form>
                            {searchError ?
                                <FormHelperText>Search must be of sufficient length. And no quote marks!</FormHelperText>
                            :null}
                        </Search>
                            {user ?
                            <>
                                <Tooltip disableFocusListener title={user.username}>
                                    <IconButton name="aviClick" p={0} onClick={handleOpenUserMenu} disableRipple={true}>
                                        <Avatar alt="avatar" src={`/icons/${user.icon}`}/>
                                    </IconButton>
                                </Tooltip>
                                <ThemeProvider theme={userMenuTheme}>
                                    <Menu mt='45px' id="navbar" anchorEl={navEl} anchorOrigin={{vertical: 'top', horizontal: 'right'}} keepMounted
                                            transformOrigin={{vertical: 'top', horizontal: 'right'}} open={userMenuOpen} onClose={handleCloseUserMenu}>
                                        <MenuItem key="profile" onClick={handleCloseUserMenu}>
                                            <Link href="/profile" underline='hover' color="#f3f2f2">
                                                <Typography textAlign="center" component='span'>Profile</Typography>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link href='/logout' underline="hover" color="#f3f2f2">
                                                <Typography textAlign="center" component='span'>Log Out</Typography>
                                            </Link>
                                        </MenuItem>
                                    </Menu>
                                </ThemeProvider>
                            </>
                            :<>
                                <Link href='/signup' underline='hover' color='#f3f2f2' sx={{marginRight: '3.3em'}}>
                                    Signup
                                </Link>
                                <Link href='/login' underline='hover' color="#f3f2f2">
                                    Login
                                </Link>
                            </>
                            }
                        </Toolbar>
                        {menuAuthors && menuIssues ?
                        <>
                            <Drawer sx={drawerStyle} variant="persistent" anchor="left" open={menuOpen}>
                                <List sx={{paddingTop: '0px'}}>
                                    <ListSubheader>
                                        <Typography component='span' sx={{marginRight: '1.5em'}}>
                                        </Typography>
                                        <IconButton color="inherit" onClick={() => setMenuOpen(false)} sx={{float: 'right', marginTop: '3px'}} disableRipple={true}>
                                            <CancelIcon sx={{height: '.8em'}}/>
                                        </IconButton>
                                    </ListSubheader>
                                    <ListItem>
                                        <Link href="/" underline='hover' color="#f3f2f2">
                                            <Typography color="inherit" component='span'>
                                                <ListItemText primary="Current Issue" />
                                            </Typography>
                                        </Link>
                                    </ListItem>
                                    <ListItem key="issues" onClick={handleIssuesOpen} sx={{display:'block', width: '75%'}}>
                                        <Typography component='span'>
                                            <ListItemText sx={{float: 'left'}} primary="Issues" />
                                        </Typography>
                                        <ListItemIcon sx={{float:'right'}}>
                                            <ChevronRightIcon sx={{color: '#f3f2f2'}}/>
                                        </ListItemIcon>
                                    </ListItem>
                                    <ListItem key="authors" onClick={handleAuthorsOpen} sx={{display:'block', float: 'left', width: '75%'}}>
                                        <Typography component='span'>
                                            <ListItemText sx={{float: 'left'}} primary="Authors" />
                                        </Typography>
                                        <ListItemIcon sx={{float:'right'}}>
                                            <ChevronRightIcon sx={{color: '#f3f2f2'}}/>
                                        </ListItemIcon>
                                    </ListItem>
                                    <ListItem>
                                        <Link href="/games" underline='hover' color="#f3f2f2">
                                            <Typography color="inherit" component='span'>
                                                <ListItemText primary="Games!" />
                                            </Typography>
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link href="/about" underline='hover' color="#f3f2f2">
                                            <Typography color="inherit" component='span'>
                                                <ListItemText primary="About" />
                                            </Typography>
                                        </Link>
                                    </ListItem>
                                </List>
                            </Drawer>

                            <Drawer sx={drawerStyle} variant="persistent" anchor="left" open={authorsOpen}>
                                <List sx={{paddingTop: '0px'}}>
                                    <ListSubheader>
                                        <ListItemIcon>
                                            <ChevronLeftIcon onClick={handleAuthorsClose} sx={{height: '1.5em'}}/>
                                        </ListItemIcon>
                                        <IconButton color="inherit" onClick={() => setAuthorsOpen(false)} sx={{float: 'right', marginTop: '3px'}} disableRipple={true}>
                                            <CancelIcon sx={{height: '.8em'}}/>
                                        </IconButton>
                                        <Typography textAlign="center">
                                            Authors
                                        </Typography>
                                    </ListSubheader>
                                {menuAuthors.map((author, idx) => {
                                    return(
                                        <ListItem key={idx}>
                                            <Link href={`/author/${author.authorHandle}`} underline='hover' color="#f3f2f2">
                                                <Typography component='span'>
                                                    <ListItemText primary={author.authorFirst+' '+author.authorLast} />
                                                </Typography>
                                            </Link>
                                        </ListItem>
                                    )
                                })}
                                </List>
                            </Drawer>

                            <Drawer sx={drawerStyle} variant="persistent" anchor="left" open={issuesOpen}>
                                <List sx={{paddingTop: '0px'}}>
                                    <ListSubheader>
                                        <ListItemIcon>
                                            <ChevronLeftIcon onClick={handleIssuesClose} sx={{height: '1.5em'}} />
                                        </ListItemIcon>
                                        <IconButton color="inherit" onClick={() => setIssuesOpen(false)} sx={{float: 'right', marginTop: '3px'}} disableRipple={true}>
                                            <CancelIcon sx={{height: '.8em'}}/>
                                        </IconButton>
                                        <Typography textAlign="center">
                                            Issues
                                        </Typography>
                                    </ListSubheader>
                                {menuIssues.map((issue, idx) => {
                                    return (
                                        <ListItem key={idx} sx={{display:'block', width: '75%'}}>
                                            <Tooltip title={'published ' + new Date(issue.pubDate).toLocaleString()}>
                                                <Typography component='span'>
                                                    <ListItemText sx={{float: 'left'}} primary={issue.issueTitle} />
                                                </Typography>
                                            </Tooltip>
                                            <ListItemIcon sx={{marginRight: '1.5em', float: 'right'}}>
                                                <ChevronRightIcon onClick={() => handleArticlesOpen(issue.id)} sx={{color: '#f3f2f2'}}/>
                                            </ListItemIcon>
                                        </ListItem>             
                                    )   
                                })}
                                </List>
                            </Drawer>

                            <Drawer sx={drawerStyle} variant="persistent" anchor="left" open={articlesOpen}>
                                <List sx={{paddingTop: '0px'}}>
                                    <ListSubheader>
                                        <ListItemIcon>
                                            <ChevronLeftIcon onClick={handleArticlesClose} sx={{height: '1.5em'}}/>
                                        </ListItemIcon>
                                        <IconButton color="inherit" onClick={() => setArticlesOpen(false)} sx={{float: 'right', marginTop: '3px'}} disableRipple={true}> 
                                            <CancelIcon sx={{height: '.8em'}}/>
                                        </IconButton>
                                        <Typography textAlign="center">
                                            Articles
                                        </Typography>
                                    </ListSubheader>
                                {menuArticles ? menuArticles.map((article, idx) => {
                                    return (
                                        <ListItem key={idx}>
                                            <Tooltip title={(article.text).length > 20 ? (article.text).substring(0,20)+ '...' : article.text }>
                                                <Link href={`/articles/${article.articleId}`} underline='hover' color="#f3f2f2">
                                                    <Typography color="inherit" component='span'>
                                                        <ListItemText primary={article.articleTitle} />
                                                    </Typography>
                                                </Link>
                                            </Tooltip>
                                        </ListItem>
                                    )
                                }): null}
                                </List>
                            </Drawer>
                        </>
                        :null}
                    </AppBar>
                </Slide>
            </ThemeProvider>
        </Box>
    );
}

export default NavigationBar;