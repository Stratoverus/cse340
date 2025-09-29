// Password toggle functionality for registration form
function togglePassword() {
  const passwordInput = document.getElementById('account_password');
  const toggleButton = document.getElementById('password-toggle');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleButton.textContent = 'Hide';
  } else {
    passwordInput.type = 'password';
    toggleButton.textContent = 'Show';
  }
}

// Form Validation Utilities
// https://www.w3schools.com/js/js_validation.asp This was crazy helpful for this part. Not sure if we're supposed to use this or not, but I like it so much better.
const FormValidator = {
    // Classification validation
    validateClassification: function(form) {
        const nameInput = form.querySelector('#classification_name');
        const errorSpan = form.querySelector('#classificationError');
        const disableCheckbox = document.querySelector('#disableValidation');
        
        if (!nameInput || !errorSpan) return;
        
        // Real-time validation as user types
        nameInput.addEventListener('input', () => {
            const isDisabled = disableCheckbox && disableCheckbox.checked;
            if (!isDisabled) {
                this.validateClassificationName(nameInput, errorSpan);
            } else {
                this.clearError(nameInput, errorSpan);
            }
        });
        
        // Form submission validation
        form.addEventListener('submit', (e) => {
            const isDisabled = disableCheckbox && disableCheckbox.checked;
            if (!isDisabled && !this.validateClassificationName(nameInput, errorSpan)) {
                e.preventDefault();
            }
        });
        
        // Clear errors when validation is disabled
        if (disableCheckbox) {
            disableCheckbox.addEventListener('change', () => {
                if (disableCheckbox.checked) {
                    this.clearError(nameInput, errorSpan);
                }
            });
        }
    },
    
    validateClassificationName: function(input, errorSpan) {
        const value = input.value.trim();
        const pattern = /^[a-zA-Z0-9]+$/;
        
        // Clear previous error
        this.clearError(input, errorSpan);
        
        if (value === '') {
            this.showError(input, errorSpan, 'Classification name is required');
            return false;
        }
        
        if (!pattern.test(value)) {
            this.showError(input, errorSpan, 'Only letters and numbers are allowed, no spaces or special characters');
            return false;
        }
        
        if (value.length < 2) {
            this.showError(input, errorSpan, 'Classification name must be at least 2 characters long');
            return false;
        }
        
        if (value.length > 30) {
            this.showError(input, errorSpan, 'Classification name must be less than 30 characters');
            return false;
        }
        
        return true;
    },
    
    // Inventory validation
    validateInventory: function(form) {
        const fields = {
            classification_id: { element: form.querySelector('#classificationList'), error: form.querySelector('#classificationError') },
            inv_make: { element: form.querySelector('#inv_make'), error: form.querySelector('#makeError') },
            inv_model: { element: form.querySelector('#inv_model'), error: form.querySelector('#modelError') },
            inv_year: { element: form.querySelector('#inv_year'), error: form.querySelector('#yearError') },
            inv_color: { element: form.querySelector('#inv_color'), error: form.querySelector('#colorError') },
            inv_price: { element: form.querySelector('#inv_price'), error: form.querySelector('#priceError') },
            inv_miles: { element: form.querySelector('#inv_miles'), error: form.querySelector('#milesError') },
            inv_description: { element: form.querySelector('#inv_description'), error: form.querySelector('#descriptionError') },
            inv_image: { element: form.querySelector('#inv_image'), error: form.querySelector('#imageError') },
            inv_thumbnail: { element: form.querySelector('#inv_thumbnail'), error: form.querySelector('#thumbnailError') }
        };
        
        const disableCheckbox = document.querySelector('#disableValidation');
        
        // Add real-time validation to all fields
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field.element && field.error) {
                field.element.addEventListener('input', () => {
                    const isDisabled = disableCheckbox && disableCheckbox.checked;
                    if (!isDisabled) {
                        this.validateInventoryField(fieldName, field);
                    } else {
                        this.clearError(field.element, field.error);
                    }
                });
                field.element.addEventListener('blur', () => {
                    const isDisabled = disableCheckbox && disableCheckbox.checked;
                    if (!isDisabled) {
                        this.validateInventoryField(fieldName, field);
                    } else {
                        this.clearError(field.element, field.error);
                    }
                });
            }
        });
        
        // Form submission validation
        form.addEventListener('submit', (e) => {
            const isDisabled = disableCheckbox && disableCheckbox.checked;
            if (!isDisabled) {
                let isValid = true;
                Object.keys(fields).forEach(fieldName => {
                    const field = fields[fieldName];
                    if (field.element && field.error && !this.validateInventoryField(fieldName, field)) {
                        isValid = false;
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                }
            }
        });
        
        // Clear errors when validation is disabled
        if (disableCheckbox) {
            disableCheckbox.addEventListener('change', () => {
                if (disableCheckbox.checked) {
                    Object.keys(fields).forEach(fieldName => {
                        const field = fields[fieldName];
                        if (field.element && field.error) {
                            this.clearError(field.element, field.error);
                        }
                    });
                }
            });
        }
    },
    
    validateInventoryField: function(fieldName, field) {
        const value = field.element.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        this.clearError(field.element, field.error);
        
        // Common validation
        if (value === '') {
            errorMessage = this.getFieldDisplayName(fieldName) + ' is required';
            isValid = false;
        } else {
            // Field-specific validation
            switch (fieldName) {
                case 'classification_id':
                    if (value === '') {
                        errorMessage = 'Please select a classification';
                        isValid = false;
                    }
                    break;
                    
                case 'inv_make':
                case 'inv_model':
                case 'inv_color':
                    if (value.length < 2) {
                        errorMessage = this.getFieldDisplayName(fieldName) + ' must be at least 2 characters';
                        isValid = false;
                    } else if (value.length > 30) {
                        errorMessage = this.getFieldDisplayName(fieldName) + ' must be less than 30 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'inv_year':
                    const yearPattern = /^\d{4}$/;
                    if (!yearPattern.test(value)) {
                        errorMessage = 'Year must be a valid 4-digit number';
                        isValid = false;
                    } else {
                        const year = parseInt(value);
                        const currentYear = new Date().getFullYear();
                        if (year < 1900 || year > currentYear + 1) {
                            errorMessage = `Year must be between 1900 and ${currentYear + 1}`;
                            isValid = false;
                        }
                    }
                    break;
                    
                case 'inv_price':
                case 'inv_miles':
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                        errorMessage = this.getFieldDisplayName(fieldName) + ' must be a positive number';
                        isValid = false;
                    } else if (numValue > 999999999) {
                        errorMessage = this.getFieldDisplayName(fieldName) + ' is too large';
                        isValid = false;
                    }
                    break;
                    
                case 'inv_description':
                    if (value.length < 10) {
                        errorMessage = 'Description must be at least 10 characters';
                        isValid = false;
                    } else if (value.length > 1000) {
                        errorMessage = 'Description must be less than 1000 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'inv_image':
                case 'inv_thumbnail':
                    if (!value.startsWith('/') && !value.startsWith('http')) {
                        errorMessage = 'Image path must start with / or http';
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (!isValid) {
            this.showError(field.element, field.error, errorMessage);
        }
        
        return isValid;
    },
    
    getFieldDisplayName: function(fieldName) {
        const displayNames = {
            'classification_id': 'Classification',
            'inv_make': 'Make',
            'inv_model': 'Model',
            'inv_year': 'Year',
            'inv_color': 'Color',
            'inv_price': 'Price',
            'inv_miles': 'Miles',
            'inv_description': 'Description',
            'inv_image': 'Image path',
            'inv_thumbnail': 'Thumbnail path'
        };
        return displayNames[fieldName] || fieldName;
    },
    
    // Utility methods
    showError: function(input, errorSpan, message) {
        if (errorSpan) errorSpan.textContent = message;
        if (input) input.classList.add('error');
    },
    
    clearError: function(input, errorSpan) {
        if (errorSpan) errorSpan.textContent = '';
        if (input) input.classList.remove('error');
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Classification form
    const classificationForm = document.getElementById('addClassificationForm');
    if (classificationForm) {
        FormValidator.validateClassification(classificationForm);
    }
    
    // Inventory form
    const inventoryForm = document.getElementById('addInventoryForm');
    if (inventoryForm) {
        FormValidator.validateInventory(inventoryForm);
    }
});