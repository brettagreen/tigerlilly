function validate(form, update=false) {
    let error = false;
    const pwRequirements = "password must be at least 8 characters long and contain at least" +
            " 1 capital letter, 1 number, and 1 special character (@&!*...)";

    Object.entries(form).forEach(item => {
        if (item[0] !== 'icon') {

            //start with clean error form
            form[item[0]] = {...form[item[0]], error: false, errorMsg: []}

            if ((update && item[1].value !== '') || !update) {
                if (item[1].value === '') {
                    error = true;
                    console.log('empty field condition');
                    form[item[0]] = {...form[item[0]], error: true, errorMsg: [...form[item[0]].errorMsg, 'field must contain a value']};
    
                } else if (item[1].value.length < item[1].min) {
                    error = true;
                    console.log('length too short condition');
                    form[item[0]] = {...form[item[0]], error: true, errorMsg: [...form[item[0]].errorMsg, `field must be at least ${item[1].min} characters long`]};
    
                } else if ((item[1].value.length > item[1].max)) {
                    error = true;
                    console.log('length too long condition');
                    form[item[0]] = {...form[item[0]], error: true, errorMsg: [...form[item[0]].errorMsg, `field must be ${item[1].max} characters or fewer`]};
    
                } else if (item[1].pattern && !item[1].pattern.test(item[1].value)) {
                    if (item[0].includes('assword')) { //assword!
                        error = true;
                        form[item[0]] = {...form[item[0]], error: true, errorMsg: [...form[item[0]].errorMsg, `${pwRequirements}`]};
                    } else { //email
                        error = true;
                        form[item[0]] = {...form[item[0]], error: true, errorMsg: [...form[item[0]].errorMsg, 'must be a valid email address']};
                    }
                }
            }

        }
    });

    if (form.password.value !== form.confirmPassword.value) {
        console.log('passwords don\'t match');
        error = true;
        form.password = {...form.password, error: true, errorMsg: [...form.password.errorMsg, 'password fields must match']};
        form.confirmPassword = {...form.confirmPassword, error: true, errorMsg: [...form.confirmPassword.errorMsg, 'password fields must match']};
    }

    return [error, form];
}

export default validate;