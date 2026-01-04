
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: "PixelCraft 2D - Desktop Edition",
    icon: path.join(__dirname, 'icon.png'), // Standard icon path
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#1e293b',
  });

  // Hide the default menu bar for a cleaner game look
  win.setMenuBarVisibility(false);

  // In production, we'd load the build folder. 
  // In this dev environment, we load index.html directly.
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
