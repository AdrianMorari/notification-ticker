const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } = require('electron');
const path = require('node:path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 50,
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
        mainWindow.setPosition(0, 770);
    });

    ipcMain.on('hide-window', () => {
        mainWindow.hide();
    });

    ipcMain.on('show-context-menu', (event) => {
        const template = [
            { label: 'Reload', click: () => { event.sender.reload(); } },
            { label: 'Mark as read', click: () => { event.sender.close(); } },
            { label: 'Quit', click: () => { app.quit(); } },
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup(BrowserWindow.fromWebContents(event.sender));
    });
}

app.whenReady().then(() => {
    let tray = null;
    let modal = null;


    const icon = nativeImage.createFromPath('assets/icon.png');
    tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open modal',
            click: () => {
                modal = new BrowserWindow({
                    frame: false,
                    skipTaskbar: true,
                    autoHideMenuBar: true,
                    resizable: false,
                    webPreferences: {
                        preload: path.join(__dirname, 'preload.js'),
                        contextIsolation: true,
                        enableRemoteModule: false,
                        nodeIntegration: false,
                    },
                });
                modal.loadFile('modal.html');

                ipcMain.on('hide-modal', () => {
                    if (modal) {
                        modal.hide();
                    }
                });
            }
        },
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

    // Create the main window
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
