//typedefs
/**
 * @typedef {Object} user - returned user object 
 * @property {number} id 
 * @property {string} username
 * @property {string} userFirst
 * @property {string} userLast
 * @property {string} email
 * @property {boolean} isAdmin
 * @property {string} icon
 *
*/

import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormControl, TextField, Button, Box, ThemeProvider, Alert, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { formTheme } from '../css/styles';
import UserContext from '../userContext';
import TigerlillyApi from '../api';
import validate from '../helpers/formValidation';
import '../css/user.css';

/**
 * @component /frontend/src/components/User
 * @requires module:react.useContext
 * @requires module:react.useState
 * @requires module:react.useEffect
 * @requires module:react.useRef
 * @requires module:react-router-dom.useNavigate
 * @requires module:mui/material/FormControl
 * @requires module:mui/material/TextField
 * @requires module:mui/material/Button
 * @requires module:mui/material/Box
 * @requires module:mui/material/ThemeProvider
 * @requires module:mui/material/Alert
 * @requires module:mui/material/IconButton
 * @requires module:mui/material/InputAdornment
 * @requires module:mui/material/FormHelperText
 * @requires module:mui/icons-material/VisibilityOutlined
 * @requires module:mui/icons-material/VisibilityOff
 * @requires module:/frontend/src/css/styles.formTheme
 * @requires module:/frontend/src/userContext
 * @requires module:/frontend/src/api
 * @requires module:/frontend/src/helpers/formValidation
 * 
 * @description User component. 1) displays user info. very simple. 2) allows user to update their user info, using the same component, now
 * configured to handle form submission.
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @returns {JSX.Element} - some headers and user form, either in view mode or in update mode.
 *
 */
function User() {

    /**
     * the useNavigate object allows for programmatic site navigation.
     * @see https://reactrouter.com/en/6.22.3/hooks/use-navigate
     * @type {Object}
     */
    const history = useNavigate();

    /**
     * @type {user}
     */
    const user = useContext(UserContext).user;

    /**
     * set global user upon successful completion of sign up process
     * @type {function}
     */
    const setCurrentUser = useContext(UserContext).setCurrentUser;

    /**
     * form object that also contains field pertaining to form field validation and error message handling
     */
    const UPDATE_STATE = {
        username: {value: '', error: false, errorMsg: [], min: 3, max: 30},
        password: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        confirmPassword: {value: '', error: false, errorMsg: [], min: 8, max: 30, pattern: /[A-Za-z]{1,}\d{1,}[^a-zA-Z\d]{1,}/},
        userLast: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        userFirst: {value: '', error: false, errorMsg: [], min: 1, max: 30},
        email: {value: '', error: false, errorMsg: [], min: 6, max: 50, pattern: /[a-zA-Z\d]*@[a-zA-Z\d]*\.[A-Za-z]{2,3}/},
        icon: null
    }

    /**
     * @typedef {Object} controlForm - useState hook. form for updating user's profile
     * @property {UPDATE_STATE} form - update profile form
     * @property {function} setForm - set form object
     */
    /**
     * @type {controlForm}
     */
    const [form, setForm] = useState(null);

    /**
     * @typedef {Object} controlShow1 - useState hook. if show1 val == true, then user can see the value of the form's password field.
     * @property {boolean} show1 - true/false show in plaintext 'password' field text. defaults to false.
     * @property {function} setShow1 - set whether 'password' plaintext is shown or not
     */
    /**
     * @type {controlShow1}
     */
    const [show1, setShow1] = useState(false);

    /**
     * @typedef {Object} controlShow2 - useState hook. if show2 val == true, then user can see the value of the form's confirm password field.
     * @property {boolean} show2 - true/false show in plaintext 'confirmPassword' field text. defaults to false.
     * @property {function} setShow2 - set whether 'confirmPassword' plaintext is shown or not
     */
    /**
     * @type {controlShow2}
     */
    const [show2, setShow2] = useState(false);

    /**
     * mui InputAdornment element that wraps closed/open eye icon that is placed at the end of the password field
     * @type {JSX.Element}
     */
    const pwIcon1 = { endAdornment: <InputAdornment position="end"><IconButton>{show1?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };
    /**
     * mui InputAdornment element that wraps closed/open eye icon that is placed at the end of the confirm password field
     * @type {JSX.Element}
     */
    const pwIcon2 = { endAdornment: <InputAdornment position="end"><IconButton>{show2?<VisibilityOutlinedIcon />
                        :<VisibilityOffIcon />}</IconButton></InputAdornment> };

    /**
     * @typedef {Object} controlUpdate - useState hook. if fileAlertOpen == true, show the Alert component with its warning
     * @property {boolean} update - true/false whether file Alert warning is visible
     * @property {function} setUpdate - set whether file Alert warning is visible
     */
    /**
     * @type {controlFileAlert}
     */
    const [update, setUpdate] = useState(false);

    /**
     * @typedef {Object} controlFileAlert - useState hook. if fileAlertOpen == true, show the Alert component with its warning
     * @property {boolean} fileAlertOpen - true/false whether file Alert warning is visible
     * @property {function} setFileAlertOpen - set whether file Alert warning is visible
     */
    /**
     * @type {controlFileAlert}
     */
    const [fileAlertOpen, setFileAlertOpen] = useState(false);

    /**
     * the useRef is a hook "that lets you reference a value that’s not needed for rendering"
     * @see https://react.dev/reference/react/useRef
     * in this case, <input type="file" input is HIDDEN and its functionality taken over but a <button element. when button
     * is clicked, the hiddenFileInput ref is used to 'click' the hidden file component (and bring up the select file menu as expected)
     * @type {Object}
     */
    const hiddenFileInput = useRef();

    /**
     * controlled form event, updates any form value on change. also triggers file alert to appear if file size exceeds 3mb
     * @param {Object} event 
     * @returns {undefined}
     */
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

    /**
     * checks to see if there are any errors with the form before submitting it. if there are errors, the validate function
     * will return the form that was submitted to it with the appropriate error message(s) for relevant fields.
     * otherwise, user account is updated, user auth token is set globally, and user info w/ new updates is displayed on the page
     * @param {Object} event 
     * @returns {undefined}
     */
    async function submitAndClear(event) {
        event.preventDefault();

        /**
         * @typedef {Object} controlValidate - valide() will return an error boolean and a form object. if error == true, then returned form
         * will hold values for which field(s) are in error long with appropriate error messages. OTHERWISE, the returned form is disregarded. 
         * @property {boolean} error - true/false whether the submitted form contains error(s)
         * @property {UPDATE_STATE} errorForm - this is the originally loaded UPDATE_STATE form, but with with the errorMsg property of fields
         * in error filled in with error message(s)
         */
        /**
         * @type {controlValidate}
         */
        const [error, errorForm] = validate({...form}, update);

        if (!error) {
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
            /**
             * @type {user}
             */
            const updatedUser = await TigerlillyApi.updateProfile(user.id, submitForm);
            setCurrentUser(updatedUser.users);
        } else {
            setForm(errorForm);
        }

    }

    /**
     * simulates opening of choose file menu
     * @returns {undefined}
     */
    function handleFileClick() {
        hiddenFileInput.current.click();
    };

    /**
     * if user wishes to cancel any profile updates, the form object values will be returned to initial values
     * @returns {undefined}
     */
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
        /**
         * not logged in, no user object found in UserContext? Be gone!
         * @returns {undefined}
         */
        function allowed() {
            if (!user) {
                history('/unauthorized/noProfile');
            }
        }

        /**
         * set form values with user data
         * @returns {undefined}
         */
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
            <div className="PageHeader">
                <h2>Update your profile</h2>
                <h3>Only fields you provide a value for will be updated</h3>
                <h4>click on a field to see its current - unupdated - value</h4>
            </div>
        :null}

        {form?<ThemeProvider theme={formTheme}>
                <div className="BackdropWrapper" style={{marginTop:'10vh', minWidth: '80vw', minHeight: '40vh'}}>
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
