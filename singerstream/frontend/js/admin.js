async function loadContentList() {
  const container = document.getElementById('contentList');
  if (!container) return;

  try {
    const results = await api.get('/content?limit=100');
    const content = results.content || [];

    if (!content.length) {
      container.innerHTML = '<p>No content uploaded yet.</p>';
      return;
    }

    container.innerHTML = content.map(item => `
      <div class="item">
        <span>${item.title} (${item.type})</span>
        <button class="delete" data-id="${item.id}">Delete</button>
      </div>
    `).join('');

    container.querySelectorAll('button.delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Delete this content?')) return;
        try {
          await api.delete(`/content/${id}`);
          loadContentList();
        } catch (err) {
          alert(err.message || 'Delete failed');
        }
      });
    });
  } catch (error) {
    console.error('Failed to load content list:', error);
    container.innerHTML = '<p>Failed to load content.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAdmin()) return;
  window.loadContentList = loadContentList;
  loadContentList();
});
