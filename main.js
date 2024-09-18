const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, shell } = require('electron');
const path = require('node:path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 40,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
        },
        titleBarStyle: 'hidden',
        skipTaskbar: true,
        autoHideMenuBar: true,
        alwaysOnTop: true,
    });

    mainWindow.loadFile('index.html').then(() => {
        mainWindow.setPosition(0, 1080);
    });

    mainWindow.webContents.openDevTools();

    ipcMain.on('hide-window', () => {
        mainWindow.hide();
    });

    ipcMain.on('show-context-menu', (event) => {
        const template = [
            { label: 'Copy', icon: nativeImage.createFromPath(path.join(__dirname, 'assets/copy.png')), click: () => { event.sender.reload(); } },
            { label: 'Mark as Read', icon: nativeImage.createFromPath(path.join(__dirname, 'assets/double-check.png')), click: () => { event.sender.close(); } },
            { label: 'Link to BO', icon: nativeImage.createFromPath(path.join(__dirname, 'assets/external-link.png')), click: () => { app.quit(); } },
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup(BrowserWindow.fromWebContents(event.sender));
    });
}

app.whenReady().then(() => {
    let tray = null;

    const icon = nativeImage.createFromPath('assets/icon2.png');
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Verify incoming messages', type: 'radio' },
        { label: 'Quit', click: () => { app.quit(); } }
    ]);

    const messages = true;
    tray.setToolTip(messages ? 'You have unread messages' : 'No unread messages');
    tray.setTitle('This is my title');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        const leftClickMenu = Menu.buildFromTemplate([
            { label: 'Check unread messages', click: () => { console.log('Open only unread messages'); } },
            { label: 'Check messages', click: () => { console.log('Open all messages'); } },
        ]);
        tray.popUpContextMenu(leftClickMenu);
    });

    createWindow();
});

app.setAsDefaultProtocolClient('notification-ticker');

ipcMain.on('open-google-login', (event) => {
    const loginWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    loginWindow.loadURL('https://staging-bo.tmgbo.com/');

    loginWindow.webContents.on('did-finish-load', () => {
        setTimeout(() => {
            event.sender.send('google-login-success', { token: 'fake-google-token' });
            loginWindow.close();
        }, 10000);
    });
});

ipcMain.on('open-external-link', (event, url) => {
    shell.openExternal(url);
});
