function setRegisterError(message) {
  const errorBox = document.getElementById('error');
  if (errorBox) {
    errorBox.textContent = message || '';
  }
}

async function handleRegister(event) {
  event.preventDefault();
  setRegisterError('');

  const username = document.getElementById('username')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const password = document.getElementById('password')?.value || '';

  if (!username || !password) {
    setRegisterError('Username and password are required.');
    return;
  }

  try {
    await auth.register(username, email, password);
    window.location.href = '/library.html';
  } catch (error) {
    setRegisterError(error.message || 'Registration failed. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', handleRegister);
  }
});
