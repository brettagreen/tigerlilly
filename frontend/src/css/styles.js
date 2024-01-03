import createTheme from "@mui/material/styles/createTheme";

const formTheme = 
	createTheme({
		components: {
			MuiMenuList: {
				styleOverrides: {
					root: {
						"&.Mui-selected": {
							backgroundColor: '#fcfafa'
						},
						"&.Mui-hover": {
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
						marginBottom: '.5em',
						width: '100%'
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


export {formTheme, textareaTheme};