import createTheme from "@mui/material/styles/createTheme";

/**
 * width of user's viewport.
 * basically being used to help calculate inline @media/ query so as to 
 * appropriately render borders for Issue Articles
 * 
 *@type {number}
*/
const VIEW_WIDTH = document.documentElement.clientWidth;

/**
 * @module /frontend/src/css/styles
 * @requires module:mui/material/styles/createTheme
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @description defines various css override values as it pertains to certain mui components. These Theme objects are used throughout the app
 * on a per-use basis using the mui ThemeProvider component with the theme prop.
 * @example  <ThemeProvider theme={formTheme}>
 *               <div className="BackdropWrapper">
 *                   <form autoComplete="off" noValidate encType="multipart/form-data" onSubmit={submitAndClear}>
 *					...
 *			 </ThemeProvider>
 * @returns {Theme} - various Theme objects
 */
const formTheme = 
	createTheme({
		components: {
			MuiMenuList: {
				styleOverrides: {
					root: {
						"&.Mui-selected": {
							backgroundColor: '#fcfafa'
						},
						"&.:hover": {
							backgroundColor: '#f3f2f2'
						}
					}
				}
			},
			MuiInputBase: {
				styleOverrides: {
					root: {
						height: '2em',
						marginTop: '.5em',
						marginBottom: '.8em',
						width: '100%',
						'&.Mui-focused': {
							borderColor: "rgba(0,0,0,.9)"
						}
					}
				}
			},
			MuiFormLabel:  {
				styleOverrides: {
					root: {
						'&.:after': {
							color: "rgba(0, 0, 0, 0.9)"
						}
					}
				}
			},
			MuiButtonBase: {
				styleOverrides: {
					root: {
						'&.:hover': {
							bgcolor: 'transparent',
							borderColor: "rgba(0,0,0,.9)"
						},
						'&.Mui-focused': {
							borderColor: "rgba(0,0,0,.9)"
						}
					}
				}
			},
			MuiFormHelperText: {
				styleOverrides: {
					root: {
						marginTop: '-4px',
						marginBottom: '14px'
					}
				}
			}
		}
	});

const textareaTheme =
	createTheme({
		components: {
			MuiInputBase: {
				styleOverrides: {
					root: {
						height: 'inherit',
						marginTop: '.5em',
						marginBottom: '.5em',
						width: '100%'
					}
				}
			}
		}
	});

const linkTheme =
	createTheme({
		components: {
			MuiLink: {
				styleOverrides: {
					root: {
						color: '#434445',
						textDecorationColor: '#434445',
						fontWeight: 'bold'
					}
				}
			}
		}
	});

const gridTheme =
	createTheme({
		components: {
			MuiGrid: {
				styleOverrides: {
					root: {
						'@media (min-width: 600px)': {
							width: '100%',
							marginLeft: '0',
							paddingLeft: '24px',
							paddingRight: '24px'
						},
						'@media (min-width: 900px)': {
							width: '100%',
							marginLeft: '0',
							paddingLeft: '24px',
							paddingRight: '24px'
						},
						'@media (min-width: 0px)': {
							width: '100%',
							marginLeft: '0',
							paddingLeft: '24px',
							paddingRight: '24px'
						}
					}
				}
			}
		}		
	});

const toolbarMenuTheme =
	createTheme({
		components: {
			MuiAppBar: {
				styleOverrides: {
					root: {
						color: '#f3f2f2',
						background: 'linear-gradient(90deg, rgba(241, 146, 111, .85) 40%, rgba(0, 0, 0, .85))',
						width: '22vw'
					}
				}
			},
			MuiDrawer: {
				styleOverrides: {
					paper: {
						color: '#f3f2f2',
						backgroundColor: 'rgba(0,0,0,.85)',
						width: '22vw'
					}
				}
			},
			MuiListSubheader: {
				styleOverrides: {
					root: {
						backgroundColor: 'rgba(189, 183, 107, .85)',
						paddingLeft: '10px',
						paddingRight: '10px',
						height: '64px',
						lineHeight: '0px'
					}
				}
			},
			MuiMenu: {
				styleOverrides: {
					list: {
						backgroundColor: 'rgba(0,0,0,.85)'
					}
				}
			}
		}
	});

const userMenuTheme =
	createTheme({
		components: {
			MuiPaper: {
				styleOverrides: {
					root: {
						width: '11vw',
						backgroundColor: 'rgba(0,0,0,.85)',
						top: '64px',
						left: `calc(${VIEW_WIDTH}px - 11vw)`
					}
				}
			},
			MuiMenu: {
				styleOverrides: {
					paper: {
						top: '64px'
					}
				}
			}
		}
	});

export {formTheme, textareaTheme, gridTheme, toolbarMenuTheme, userMenuTheme, linkTheme};
