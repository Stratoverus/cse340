// Client-side validation for classification name
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editClassificationForm');
    const classificationInput = document.getElementById('classification_name');
    const errorSpan = document.getElementById('classificationError');
    const disableValidationCheckbox = document.getElementById('disableValidation');
    
    // Function to validate classification name
    function validateClassificationName() {
        // Skip validation if checkbox is checked. This is similar to what I have on other pages due to my javascript validation I have.
        if (disableValidationCheckbox && disableValidationCheckbox.checked) {
            errorSpan.textContent = '';
            classificationInput.setCustomValidity('');
            return true;
        }
        
        const value = classificationInput.value.trim();
        const pattern = /^[a-zA-Z0-9]+$/;
        
        if (value.length === 0) {
            errorSpan.textContent = 'Classification name is required.';
            classificationInput.setCustomValidity('Classification name is required.');
            return false;
        }
        
        if (value.length < 2 || value.length > 30) {
            errorSpan.textContent = 'Classification name must be between 2 and 30 characters.';
            classificationInput.setCustomValidity('Classification name must be between 2 and 30 characters.');
            return false;
        }
        
        if (!pattern.test(value)) {
            errorSpan.textContent = 'Classification name cannot contain spaces or special characters.';
            classificationInput.setCustomValidity('Classification name cannot contain spaces or special characters.');
            return false;
        }
        
        errorSpan.textContent = '';
        classificationInput.setCustomValidity('');
        return true;
    }
    
    // Validate on input
    classificationInput.addEventListener('input', validateClassificationName);
    
    // Validate on blur
    classificationInput.addEventListener('blur', validateClassificationName);
    
    // Clear validation when checkbox is toggled
    if (disableValidationCheckbox) {
        disableValidationCheckbox.addEventListener('change', function() {
            if (this.checked) {
                errorSpan.textContent = '';
                classificationInput.setCustomValidity('');
            } else {
                validateClassificationName();
            }
        });
    }
    
    // Validate on form submit
    form.addEventListener('submit', function(e) {
        if (!disableValidationCheckbox || !disableValidationCheckbox.checked) {
            if (!validateClassificationName()) {
                e.preventDefault();
                classificationInput.focus();
            }
        }
    });
});
