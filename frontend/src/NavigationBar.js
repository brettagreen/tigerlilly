import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserContext from './userContext';
import { styled, alpha } from '@mui/material/styles';
import TigerlillyApi from "./api";

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
import { ThemeProvider } from '@mui/material/styles';
import { toolbarMenuTheme, userMenuTheme } from './css/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FormHelperText  from '@mui/material/FormHelperText';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

const drawerWidth = 225;

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

const drawerStyle = {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor: 'rgba(0,0,0,.85)',
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box'
    }
};

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
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '100%',
            '&:focus': {
                width: '20ch'
            },
        }
    }
}));

function NavigationBar({ search }) {

    const [setSearchString, setSearchArray, setSearchResults, searchVal, setSearchVal] = search;
    
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [navEl, setNavEl] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [authorsOpen, setAuthorsOpen] = useState(false);
    const [issuesOpen, setIssuesOpen] = useState(false);
    const [articlesOpen, setArticlesOpen] = useState(false);

    const [menuIssues, setMenuIssues] = useState(null);
    const [menuAuthors, setMenuAuthors] = useState(null);
    const [menuArticles, setMenuArticles] = useState(null);

    const user = useContext(UserContext).user;
    const history = useNavigate();
    const menuRef = useRef();

    const [searchError, setSearchError] = useState(false);

    //naughty search words. will be removed from any keyword search
    //won't be removed from hashtag or "phrase" searches
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

    //used for controlling AppBar behavior
    const trigger = useScrollTrigger({
        disableHysteresis: true
    });

    //useLocation hook returns current page ('/','/login', etc.) in app
    //AppBar behavior is slightly different for homepage vs other pages
    const location = useLocation();

    //right facing avatar options, for logged in users
    function toggleOpenUserMenu(event) {
        setUserMenuOpen(!userMenuOpen);

        if (userMenuOpen) {
            setNavEl(event.currentTarget);
        } else {
            setNavEl(null);
        }
    };
  
    function handleCloseUserMenu() {
        setUserMenuOpen(false);
        setNavEl(null);
    };  

    //for left-aligned, hamburger menu
    function handleAuthorsOpen() {
        setMenuOpen(false);
        setAuthorsOpen(true);
    }

    function handleIssuesOpen() {
        setMenuOpen(false);
        setIssuesOpen(true);
    }

    async function handleArticlesOpen(id) {
        setArticlesOpen(true);
        setIssuesOpen(false);

        const resp = await TigerlillyApi.getIssue(id);
        setMenuArticles(resp.issues);
    }

    function handleAuthorsClose() {
        setMenuOpen(true);
        setAuthorsOpen(false);
    }

    function handleArticlesClose() {
        setIssuesOpen(true);
        setArticlesOpen(false);
    }

    function handleIssuesClose() {
        setIssuesOpen(false);
        setMenuOpen(true);
    }

    function handleMenuOpen() {
        setMenuOpen(true);
    }

    function handleSearchInput(event) {
        setSearchVal(event.target.value);
    }

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

    function handleOutsideClick(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
            setAuthorsOpen(false);
            setIssuesOpen(false);
            setArticlesOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

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
                                    <IconButton name="aviClick" p={0} onClick={toggleOpenUserMenu} disableRipple={true}>
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