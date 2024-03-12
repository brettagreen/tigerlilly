import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { FormControl, TextField, Button, ThemeProvider, Alert, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import UserContext from "./userContext";
import TigerlillyApi from './api';
import { formTheme } from './css/styles';
import validate from './helpers/formValidation';
import './css/signup.css';

function SignUp({ updateUserToken }) {

    const INITIAL_STATE = {
        username: {value: '', error: false, errorMsg: [], min: 3, max: 30},
        password: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        confirmPassword: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        userLast: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        userFirst: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        email: {value: '', error: false, errorMsg: [], min: 6, max: 50, pattern: /[a-zA-Z\d]*@[a-zA-Z\d]*\.[A-Za-z]{2,3}/},
        icon: null
    }

    const hiddenFileInput = useRef();
    const setCurrentUser = useContext(UserContext).setCurrentUser;
    const [submitted, setSubmitted] = useState(false);
    const history = useNavigate();

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const pwIcon1 = { endAdornment: <InputAdornment position="end"><IconButton onMouseOver={() => setShow1(true)}
                        onMouseLeave={() => setShow1(false)}>{show1?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };
    const pwIcon2 = { endAdornment: <InputAdornment position="end"><IconButton onMouseOver={() => setShow2(true)}
                        onMouseLeave={() => setShow2(false)}>{show2?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };

    const [form, setForm] = useState(INITIAL_STATE);
    const [fileAlertOpen, setFileAlertOpen] = useState(false);

    function handleChange(event) {
        if (event.target.name === "icon") {
            if (event.target.files[0].size > 1000000) {
                setFileAlertOpen(true);
            } else {
                setFileAlertOpen(false);
                setForm({...form, [event.target.name]: event.target.files[0]});
            }
        } else {
            setForm({...form, [event.target.name]: {...form[event.target.name], value: event.target.value}});
        }
    }

    function handleFileClick() {
        hiddenFileInput.current.click();
    };

    async function submitAndClear(event) {
        event.preventDefault();

        const [error, errorForm] = validate({...form});

        if (!error) {
            console.log('no errors!');
            const submitForm = {
                username: form.username.value,
                password: form.password.value,
                userLast: form.userLast.value,
                userFirst: form.userFirst.value,
                email: form.email.value,
                icon: form.icon
            };

            const user = await TigerlillyApi.registerUser(submitForm);
            updateUserToken(user.token);
            setCurrentUser(user.user);
            setSubmitted(true);
        } else {
            console.log('error form', errorForm);
            setForm(errorForm);
        }

    }

    useEffect(() => {
        if (submitted) {
            history('/profile');
        }   
    }, [submitted]);

    return (
        <>
            {fileAlertOpen?<Alert open={fileAlertOpen} variant="filled" severity="warning" onClose={() => setFileAlertOpen(false)}>
                Please choose a file 3MB or smaller.
            </Alert>:null}

            <div className="PageHeader">
                <h2 style={{marginBottom: '0px'}}>Create your account</h2>
                <h3 style={{marginTop: '0px'}}>All fields required unless marked *optional</h3>
            </div>
            <ThemeProvider theme={formTheme}>
                <div className="BackdropWrapper">
                    <form autoComplete="off" noValidate encType="multipart/form-data" onSubmit={submitAndClear}> 
                        <FormControl margin="normal" sx={{width: '100%'}}>

                            <TextField type="text" label="username" name="username" value={form.username.value} onChange={handleChange}
                                        error={form.username.error} 
                            />
                            {form.username.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type={show1?"text":"password"} label="password" name="password" value={form.password.value}
                                        onChange={handleChange} error={form.password.error} InputProps={pwIcon1}
                                />
                            {form.password.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type={show2?"text":"password"} label="confirm password" name="confirmPassword"
                                        value={form.confirmPassword.value} onChange={handleChange} error={form.confirmPassword.error}
                                        InputProps={pwIcon2}
                            />
                            {form.confirmPassword.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type="text" label="first name" name="userFirst" value={form.userFirst.value} onChange={handleChange}
                                        error={form.userFirst.error} 
                            />
                            {form.userFirst.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type="text" label="last name" name="userLast" value={form.userLast.value} onChange={handleChange}
                                        error={form.userLast.error} 
                                />
                            {form.userLast.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            <TextField type="email" label="email" name="email" value={form.email.value} onChange={handleChange}
                                        error={form.email.error}
                            />
                            {form.email.errorMsg.map((val, idx) => {
                                return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                            })}

                            {/* icon file selection stuff*/}
                            <div style={{display: 'block'}}>
                                <Button type="button" variant="outlined" onClick={handleFileClick}
                                        sx={{ display: 'inline-block', maxWidth: '10em', backgroundColor: '#f3f2f2', fontSize: '.6em',
                                        color: '#171515', borderColor: '#171515', marginTop: '1em', fontVariant: 'small-caps'}}
                                >Select icon</Button>
                                <span style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: '0.5em'}}>{form.icon?form.icon.name:"no file selected"}</span>

                                <TextField className="HiddenField" type="file" name="icon" variant="standard" onChange={handleChange}
                                            inputRef={hiddenFileInput} 
                                />
                            </div>

                            <FormHelperText sx={{marginLeft: '7px', marginTop: '2px'}}>*optional</FormHelperText>
                            <Button type="submit" variant="outlined" sx={{ maxWidth: '10em', backgroundColor: '#f3f2f2', color: '#171515', fontSize: '.6em',
                                    borderColor: '#171515', marginTop: '2em', fontVariant: 'small-caps'}}>Submit</Button>
                        </FormControl>
                    </form>
                </div>
            </ThemeProvider>
        </>
    )

}

export default SignUp;