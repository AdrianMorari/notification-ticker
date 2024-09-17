document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messagesContainer');

    const messages = [
        "Praesent sit amet tortor non enim vulputate porta.",
        "Aliquam turpis purus. Vestibulum ante ipsum primis."
    ];

    // Display messages inline with some gap
    messages.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messagesContainer.appendChild(messageDiv);
    });
});

document.getElementById('hideButton').addEventListener('click', () => {
    window.electron.send('hide-window');
  });

document.getElementById('message').addEventListener('contextmenu', (event) => {
  window.electron.send('show-context-menu');
});

document.getElementById('link').addEventListener('click', (event) => {
    event.preventDefault();
    window.electron.send('open-external-link', event.target.href);
});

document.getElementById('loginButton').addEventListener('click', () => {
  window.electron.send('open-google-login');
});