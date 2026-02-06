document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAuth()) return;

  const typeFilter = document.getElementById('typeFilter');
  if (typeFilter && auth.currentUser && auth.currentUser.role === 'fan') {
    typeFilter.value = 'song';
    typeFilter.disabled = true;
    typeFilter.title = 'Fans can only view songs';
  }
});
