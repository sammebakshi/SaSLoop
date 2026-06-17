const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Disable hardware acceleration to resolve GPU crashes/errors
// app.disableHardwareAcceleration();
// app.commandLine.appendSwitch('disable-gpu');
// app.commandLine.appendSwitch('disable-software-rasterizer');
// app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu-sandbox');

// IPC silent printing handler
ipcMain.on('print-silent', (event, { html, printerName }) => {
  console.log(`[IPC] Silent print request received for printer: "${printerName}"`);
  
  const printWin = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  printWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  printWin.webContents.on('did-finish-load', () => {
    const printOptions = {
      silent: true,
      printBackground: true
    };

    // If a custom printer name is set and is not the default label, use it
    if (printerName && printerName !== 'Default Thermal Printer') {
      printOptions.deviceName = printerName;
    }

    printWin.webContents.print(printOptions, (success, failureReason) => {
      if (!success) {
        console.error(`[IPC] Silent print failed: ${failureReason}`);
      } else {
        console.log('[IPC] Silent print completed successfully');
      }
      printWin.destroy();
    });
  });
});
// Window control IPC handlers
ipcMain.on('window-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('window-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('window-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "SaSLoop POS",
    icon: path.join(__dirname, isDev ? '../public/logo.png' : '../dist/logo.png'),
    frame: false, // Frameless window to allow custom HTML top bar titlebar
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Allow ES module loading from file:// protocol
    },
    autoHideMenuBar: true, // Professional look
  });

  if (isDev) {
    win.loadURL('http://127.0.0.1:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
  
  win.on('maximize', () => {
    win.webContents.send('window-state-changed', { isMaximized: true });
  });
  win.on('unmaximize', () => {
    win.webContents.send('window-state-changed', { isMaximized: false });
  });

  win.maximize();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
