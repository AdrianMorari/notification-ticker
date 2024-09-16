const { shell } = require('electron');

document.getElementById('hideButton').addEventListener('click', () => {
    window.electron.send('hide-window');
  });

document.getElementById('message').addEventListener('contextmenu', (event) => {
  event.preventDefault();
  window.electron.send('show-context-menu');
});

document.getElementById('link').addEventListener('click', (event) => {
  event.preventDefault();
  shell.openExternal(event.target.href);
});

document.getElementById('loginButton').addEventListener('click', () => {
  window.electron.send('open-google-login');
});