document.addEventListener('DOMContentLoaded', () => {
  const navControls = document.querySelector('.nav-controls');
  if (!navControls) return;
  if (document.querySelector('.chat-open-btn')) return;

  const a = document.createElement('a');
  a.href = 'chat.html';
  a.target = '_blank';
  a.className = 'chat-open-btn btn btn-primary';
  a.textContent = 'Chat';

  navControls.insertBefore(a, navControls.firstChild);
});
