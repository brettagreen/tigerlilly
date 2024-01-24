import { useEffect, useState, useContext, useRef } from 'react';
import UserContext from './userContext';
import { styled } from '@mui/material/styles';
import TigerlillyApi from "./api";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
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


const drawerWidth = 225;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, menuOpen }) => ({
  
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

function NavigationBar() {
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

    const menuRef = useRef();

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
        setMenuArticles(resp['issues']);
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

function handleOutsideClick(event) {
    console.log('menuref current', menuRef.current);
    console.log('event target', event.target);
    if (menuRef.current && !menuRef.current.contains(event.target)) {
        console.log('closing menu');
        setMenuOpen(false);
        setAuthorsOpen(false);
        setIssuesOpen(false);
        setArticlesOpen(false);
    }
}

  useEffect(() => {
      document.addEventListener('click', handleOutsideClick);

      async function loadTables() {
        console.log('loading data for menu');
        let resp;

        resp = await TigerlillyApi.get('authors');
        setMenuAuthors(resp['authors']);

        resp = await TigerlillyApi.get('issues');
        setMenuIssues(resp['issues']);

    }
    loadTables();
  }, []);

  return (
    <Box ref={menuRef}>
        <ThemeProvider theme={toolbarMenuTheme}>
            <AppBar position="static" sx={{backgroundColor: 'rgba(0,0,0,.85)', width: '100%'}}>
                <Toolbar>
                <Typography sx={{ flexGrow: 1 }}>
                    <IconButton color="inherit" onClick={handleMenuOpen} edge="start" mr={2} disableRipple={true}>
                        <MenuIcon />
                    </IconButton>
                </Typography>
                    {user ?
                    <>
                        <Tooltip disableFocusListener title={user['username']}>
                            <IconButton name="aviClick" p={0} onClick={toggleOpenUserMenu} disableRipple={true}>
                                <Avatar alt="avatar" src={`/icons/${user['icon']}`}/>
                            </IconButton>
                        </Tooltip>
                        <ThemeProvider theme={userMenuTheme}>
                            <Menu mt='45px' id="navbar" anchorEl={navEl} anchorOrigin={{vertical: 'top', horizontal: 'right'}} keepMounted
                                    transformOrigin={{vertical: 'top', horizontal: 'right'}} open={userMenuOpen} onClose={handleCloseUserMenu}>
                                <MenuItem key="profile" onClick={handleCloseUserMenu}>
                                    <Link href="/profile" underline='hover' color="#fff">
                                        <Typography textAlign="center" component='span'>Profile</Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href='/logout' underline="hover" color="#fff">
                                        <Typography textAlign="center" component='span'>Log Out</Typography>
                                    </Link>
                                </MenuItem>
                            </Menu>
                        </ThemeProvider>
                    </>
                    :<>
                        <Link href='/signup' underline='hover' color='#fff'>
                            Signup
                        </Link>
                        <Link href='/login' underline='hover' color="#fff">
                            Login
                        </Link>
                    </>
                    }
                </Toolbar>
            </AppBar>
            {menuAuthors && menuIssues ? <>
            <Drawer sx={drawerStyle} variant="persistent" anchor="left" open={menuOpen}>
                <List sx={{paddingTop: '0px'}}>
                    <ListSubheader>
                        <Typography component='span' sx={{marginRight: '1.5em'}}>
                        </Typography>
                        <IconButton color="inherit" onClick={() => setMenuOpen(false)} sx={{float: 'right', marginTop: '3px'}} disableRipple={true}>
                            <CancelIcon sx={{height: '.8em'}}/>
                        </IconButton>
                    </ListSubheader>
                    <ListItem key="issues" onClick={handleIssuesOpen} sx={{display:'block', width: '75%'}}>
                        <Typography component='span'>
                            <ListItemText sx={{float: 'left'}} primary="Issues" />
                        </Typography>
                        <ListItemIcon sx={{float:'right'}}>
                            <ChevronRightIcon sx={{color: '#fff'}}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem key="authors" onClick={handleAuthorsOpen} sx={{display:'block', float: 'left', width: '75%'}}>
                        <Typography component='span'>
                            <ListItemText sx={{float: 'left'}} primary="Authors" />
                        </Typography>
                        <ListItemIcon sx={{float:'right'}}>
                            <ChevronRightIcon sx={{color: '#fff'}}/>
                        </ListItemIcon>
                    </ListItem>
                    <ListItem>
                        <Link href="/about" underline='hover' color="#fff">
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
                            <Link href={`/author/${author.authorHandle}`} underline='hover' color="#fff">
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
                                <ChevronRightIcon onClick={() => handleArticlesOpen(issue.id)} sx={{color: '#fff'}}/>
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
                                <Link href={`/articles/${article.articleId}`} underline='hover' color="#fff">
                                    <Typography color="inherit" component='span'>
                                        <ListItemText primary={article.articleTitle} />
                                    </Typography>
                                </Link>
                            </Tooltip>
                        </ListItem>
                    )
                }): null}
                </List>
            </Drawer></>
            :null}
        </ThemeProvider>
    </Box>
  );
}

export default NavigationBar;