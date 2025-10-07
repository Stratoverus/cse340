// Account Update Form Change Detection
document.addEventListener('DOMContentLoaded', function() {
    const accountUpdateForm = document.querySelector('.update-form[action="/account/update"]');
    const passwordChangeForm = document.querySelector('.update-form[action="/account/change-password"]');
    
    // Account Update Form
    if (accountUpdateForm) {
        const submitBtn = accountUpdateForm.querySelector('.update-btn');
        const firstnameInput = accountUpdateForm.querySelector('#account_firstname');
        const lastnameInput = accountUpdateForm.querySelector('#account_lastname');
        const emailInput = accountUpdateForm.querySelector('#account_email');
        
        // Store original values
        const originalValues = {
            firstname: firstnameInput ? firstnameInput.value : '',
            lastname: lastnameInput ? lastnameInput.value : '',
            email: emailInput ? emailInput.value : ''
        };
        
        // Disable submit button initially
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        
        // Function to check if any changes were made
        function checkAccountChanges() {
            const hasChanges = 
                (firstnameInput && firstnameInput.value !== originalValues.firstname) ||
                (lastnameInput && lastnameInput.value !== originalValues.lastname) ||
                (emailInput && emailInput.value !== originalValues.email);
            
            if (submitBtn) {
                submitBtn.disabled = !hasChanges;
            }
        }
        
        // Add event listeners to all inputs
        if (firstnameInput) firstnameInput.addEventListener('input', checkAccountChanges);
        if (lastnameInput) lastnameInput.addEventListener('input', checkAccountChanges);
        if (emailInput) emailInput.addEventListener('input', checkAccountChanges);
    }
    
    // Password Change Form
    if (passwordChangeForm) {
        const submitBtn = passwordChangeForm.querySelector('.update-btn');
        const passwordInput = passwordChangeForm.querySelector('#account_password');
        
        // Disable submit button initially
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        
        // Function to check if password has content
        function checkPasswordChanges() {
            const hasPassword = passwordInput && passwordInput.value.trim().length > 0;
            
            if (submitBtn) {
                submitBtn.disabled = !hasPassword;
            }
        }
        
        // Add event listener to password input
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordChanges);
        }
    }
});
