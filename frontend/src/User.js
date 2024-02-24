import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, TextField, Button, Box, ThemeProvider, Alert, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { formTheme } from './css/styles';
import UserContext from './userContext';
import TigerlillyApi from './api';
import validate from './helpers/formValidation';
import './css/user.css';

function User() {
    const history = useNavigate();

    const user = useContext(UserContext).user;
    const setCurrentUser = useContext(UserContext).setCurrentUser;
    const [form, setForm] = useState(null);

    const UPDATE_STATE = {
        username: {value: '', error: false, errorMsg: [], min: 3, max: 30},
        password: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        confirmPassword: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        userLast: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        userFirst: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        email: {value: '', error: false, errorMsg: [], min: 6, max: 50, pattern: /[a-zA-Z\d]*@[a-zA-Z\d]*\.[A-Za-z]{2,3}/},
        icon: null
    }

    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const pwIcon1 = { endAdornment: <InputAdornment position="end"><IconButton>{show1?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };
    const pwIcon2 = { endAdornment: <InputAdornment position="end"><IconButton>{show2?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };

    const [update, setUpdate] = useState(false);
    const [fileAlertOpen, setFileAlertOpen] = useState(false);
    const hiddenFileInput = useRef();

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

    async function submitAndClear(event) {
        event.preventDefault();

        const [error, errorForm] = validate({...form}, update);

        if (!error) {
            console.log('no errors? let\'s continue!');
            const submitForm = {};

            //filter out non-updated fields
            Object.entries(form).forEach(item => {
                if (item[0] === 'icon') {
                    submitForm[item[0]] = item[1];
                } else {
                    if(item[1].value) submitForm[item[0]] = item[1].value;
                }
            });
    
            setUpdate(false);
            const updatedUser = await TigerlillyApi.updateProfile(user.id, submitForm);
            console.log("updated user", updatedUser);
            setCurrentUser(updatedUser.users);
        } else {
            console.log('error(s)!', errorForm);
            setForm(errorForm);
        }

    }

    function handleFileClick() {
        hiddenFileInput.current.click();
    };

    function revertUpdate() {
        setUpdate(false); 
        setForm({
            password: {value: ''},
            confirmPassword: {value: ''},
            username: {value: user.username},
            userFirst: {value: user.userFirst},
            userLast: {value: user.userLast},
            email: {value: user.email},
            icon: null
        });
    }

    useEffect(() => {
        function allowed() {
            if (!user) {
                history('/unauthorized/noProfile');
            }
        }

        function updatedUser() {
            setForm({
                password: {value: ''},
                confirmPassword: {value: ''},
                username: {value: user.username},
                userFirst: {value: user.userFirst},
                userLast: {value: user.userLast},
                email: {value: user.email},
                icon: null
            });
        }

        allowed();
        updatedUser();
    }, [history, user]);

    return (
        <>
        {fileAlertOpen?
            <Alert open={fileAlertOpen} variant="filled" severity="warning" onClose={() => setFileAlertOpen(false)}>
                    Please choose a file 3MB or smaller.
            </Alert>:null}
        {update ? 
            <div id="instructions">
                <h2 className="userEditAnnouncement">Update your profile</h2>
                <h3 className="userEditAnnouncement">Only fields you provide a value for will be updated</h3>
                <h4 className="userEditAnnouncement">click on a field to see its current - unupdated - value</h4>
            </div>
        :null}

        {form?<ThemeProvider theme={formTheme}>
                <div className="FormWrapper" style={{minWidth: '80vw', minHeight: '40vh'}}>
                    <Box component="section" sx={{marginLeft: '10vw', display: 'block', float: 'left', width: '50%'}}>
                        <form autoComplete="off" encType="multipart/form-data" onSubmit={submitAndClear}>
                            <FormControl margin="normal" sx={{width: '90%'}}>

                                <TextField type="text" label="username" name="username" value={form.username.value} disabled={!update}
                                            placeholder={update?user.username:null} error={form.username.error} onChange={handleChange} />
                                {update ? form.username.errorMsg.map((val, idx) => {
                                    return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                                }):null}
                                
                                <TextField className={!update?"HiddenField":null} type={show1?"text":"password"} label="password" name="password" 
                                            value={form.password.value} onChange={handleChange} InputProps={pwIcon1} error={form.password.error}
                                            onMouseDown={() => setShow1(true)} onMouseUp={() => setShow1(false)}
                                            />
                                {update ? form.password.errorMsg.map((val, idx) => {
                                    return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                                }):null}

                                <TextField className={!update?"HiddenField":null} type={show2?"text":"password"} label="confirm password" name="confirmPassword"
                                            value={form.confirmPassword.value} onChange={handleChange} InputProps={pwIcon2} error={form.confirmPassword.error}
                                            onMouseDown={() => setShow2(true)} onMouseUp={() => setShow2(false)} />
                                {update ? form.confirmPassword.errorMsg.map((val, idx) => {
                                    return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                                }):null}
                                
                                <TextField type="text" label="first name" name="userFirst" value={form.userFirst.value} error={form.userFirst.error}
                                            onChange={handleChange} disabled={!update} placeholder={update?user.userFirst:null}/>
                                {update ? form.userFirst.errorMsg.map((val, idx) => {
                                    return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                                }):null}

                                <TextField type="text" label="last name" name="userLast" value={form.userLast.value} error={form.userLast.error}
                                            onChange={handleChange} disabled={!update} placeholder={update?user.userLast:null} />
                                {update ? form.userLast.errorMsg.map((val, idx) => {
                                    return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                                }):null}

                                <TextField type="email" label="email" name="email" value={form.email.value} error={form.email.error}
                                            onChange={handleChange} disabled={!update} placeholder={update?user.email:null}/>
                                {update ? form.email.errorMsg.map((val, idx) => {
                                    return <FormHelperText key={idx} error={true}>{val}</FormHelperText>
                                }):null}

                                {update ?
                                <div>
                                    <Button type="button" variant="outlined" onClick={handleFileClick}
                                            sx={{ display: 'inline-block', maxWidth: '10em', backgroundColor: '#f3f2f2', fontSize: '.6em',
                                            color: '#171515', borderColor: '#171515', marginTop: '1em', fontVariant: 'small-caps'}}
                                    >Select icon</Button>
                                    <span style={{display: 'inline-block', verticalAlign: 'bottom', marginLeft: '0.5em'}}>{form.icon?form.icon.name:"no file selected"}</span>

                                    <TextField className="HiddenField" type="file" name="icon" variant="standard" onChange={handleChange}
                                                inputRef={hiddenFileInput} 
                                    />
                                </div>
                                : null
                                }

                                {update ?
                                    <div>
                                        <Button type="submit" variant="outlined" sx={{ display: 'inline-block', maxWidth: '10em',
                                                    backgroundColor: '#f3f2f2', color: '#171515', fontSize: '.6em',
                                                    borderColor: '#171515', marginTop: '2em', fontVariant: 'small-caps'}}
                                        >Submit</Button>
                                        <Button type="button" variant="outlined" sx={{ display: 'inline-block', maxWidth: '10em',
                                                backgroundColor: 'red', color: '#171515', fontSize: '.6em', borderColor: '#171515',
                                                marginTop: '2em', fontVariant: 'small-caps', marginLeft: '0.5em'}} onClick={revertUpdate}
                                        >Cancel</Button>
                                    </div>
                                : null
                                }
                            </FormControl>
                        </form>

                        {!update ? <Button type="button" variant="outlined" onClick={() => {setUpdate(true); setForm(UPDATE_STATE)}} sx={{ maxWidth: '10em',
                                            backgroundColor: '#f3f2f2', color: '#171515', fontSize: '.6em',
                                            borderColor: '#171515', marginTop: '2em', fontVariant: 'small-caps'}}
                                    >edit profile</Button>
                        : null
                        }
                    </Box>
                    {user?<img style={{display: 'block', float: 'left', width: '20vh', height: '20vh', borderRadius: '4px', marginLeft: 'auto',
                                    marginRight: 'auto', marginTop: '2vh'}} src={`/icons/${user.icon}`} alt="user icon" />:null}
                </div>
            </ThemeProvider>:null}
        </>
    )

}

export default User;