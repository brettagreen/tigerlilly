import createTheme from "@mui/material/styles/createTheme";

const VIEW_WIDTH = document.documentElement.clientWidth;

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
							width: 'auto',
							marginLeft: 'auto',
							paddingLeft: '24px',
							paddingRight: '24px',
						},
						'@media (min-width: 900px)': {
							width: 'auto',
							marginLeft: 'auto',
							paddingLeft: '24px',
							paddingRight: '24px'
						},
						'@media (min-width: 0px)': {
							width: 'auto',
							marginLeft: 'auto',
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
			MuiPaper: {
				styleOverrides: {
					root: {
						color: '#fff',
						backgroundColor: 'rgba(0,0,0,.85)',
						width: '22vw'
					}
				}
			},
			MuiListSubheader: {
				styleOverrides: {
					root: {
						backgroundColor: 'rgba(239, 230, 174, .75)',
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
