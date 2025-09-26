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