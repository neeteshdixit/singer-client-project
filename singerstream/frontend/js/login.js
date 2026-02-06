function setError(message) {
  const errorBox = document.getElementById('error');
  if (errorBox) {
    errorBox.textContent = message || '';
  }
}

async function handleLogin(event) {
  event.preventDefault();
  setError('');

  const username = document.getElementById('username')?.value?.trim();
  const password = document.getElementById('password')?.value || '';

  if (!username || !password) {
    setError('Please enter your username and password.');
    return;
  }

  try {
    await auth.login(username, password);
    window.location.href = '/library.html';
  } catch (error) {
    setError(error.message || 'Login failed. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
});
