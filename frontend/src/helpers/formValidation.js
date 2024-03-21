/**
 * @module /frontend/src/helpers/formValidation
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @description receives a form, for each value in form (except 'icon' value) sees if form value meets form requirements. if not, sets field's
 * 'error' param to true and adds to field's errorMsg param value with appropriate error msg. 
 * @param {Object} form - passed form object
 * @param {boolean=false} update - is the passed form part of an update process true/false
 * @returns {[boolean, Object]} - 1) true/false an error was discovered 2) returned form, with error and errorMsg paramater values updated if 
 * errors were found 
 */
function validate(form, update=false) {
    /**
     * start with presumption that there are no errors
     * @type {boolean}
     */
    let error = false;

    /**
     * error msg to return if form's password paramater doesn't meet requirements
     * @type {string}
     */
    const pwRequirements = "password must be at least 8 characters long and contain at least" +
            " 1 capital letter, 1 number, and 1 special character (@&!*...)";

    Object.entries(form).forEach(item => {
        if (item[0] !== 'icon') {

            //start with clean error form
            form[item[0]] = {...form[item[0]], error: false, errorMsg: []}

            if ((update && item[1].value !== '') || !update) {
                if (item[1].value === '') {
                    error = true;
                    form[item[0]] = {...form[item[0]], error: true, errorMsg: [...form[item[0]].errorMsg, 'field must contain a value']};
    
                } else if (item[1].value.length < item[1].min) {
                    error = true;
                    form[item[0]] = {...form[item[0]], error: true, errorMsg: [...form[item[0]].errorMsg, `field must be at least ${item[1].min} characters long`]};
    
                } else if ((item[1].value.length > item[1].max)) {
                    error = true;
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
        error = true;
        form.password = {...form.password, error: true, errorMsg: [...form.password.errorMsg, 'password fields must match']};
        form.confirmPassword = {...form.confirmPassword, error: true, errorMsg: [...form.confirmPassword.errorMsg, 'password fields must match']};
    }

    return [error, form];
}

export default validate;