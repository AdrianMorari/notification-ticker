

document.getElementById('hideButton').addEventListener('click', () => {
    window.electron.send('hide-window');
  });
  document.getElementById('message').addEventListener('contextmenu', (event) => {
    event.preventDefault();
    window.electron.send('show-context-menu');
  });

document.getElementById('loginButton').addEventListener('click', () => {
  window.electron.send('open-google-login');
});