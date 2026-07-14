const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
// Detect if running in development mode or as an unpacked test build from the workspace folder
const appPathLower = app.getAppPath().toLowerCase();
const isDev = process.env.NODE_ENV === 'development' || 
              appPathLower.includes('release-v2') || 
              appPathLower.includes('win-unpacked') || 
              appPathLower.includes('desktop\\sasloop');

if (isDev) {
  const devUserDataPath = path.join(app.getPath('appData'), 'sasloop-master-pos-dev');
  app.setPath('userData', devUserDataPath);
}

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

// IPC PDF generation handler
ipcMain.handle('generate-pdf', async (event, { html, savePath, fileName }) => {
  return new Promise((resolve, reject) => {
    const pdfWin = new BrowserWindow({
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    const styledHtml = html.replace('</head>', `
      <style>
        body {
          zoom: 1.0 !important;
          width: 80mm !important;
          margin: 0 !important;
          padding: 8mm 6mm !important;
          box-sizing: border-box !important;
        }
      </style>
    </head>`);

    const tempHtmlPath = path.join(app.getPath('temp'), `receipt_${Date.now()}.html`);
    try {
      fs.writeFileSync(tempHtmlPath, styledHtml, 'utf8');
      pdfWin.loadFile(tempHtmlPath);
    } catch (loadErr) {
      console.error('[IPC] Failed to write temp HTML file, falling back to data URL:', loadErr);
      pdfWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(styledHtml));
    }

    pdfWin.webContents.on('did-finish-load', async () => {
      try {
        // Wait 300ms to ensure complete rendering (fonts, styles, layout)
        await new Promise(r => setTimeout(r, 300));

        let heightInInches = 15.0;
        try {
          const heightPx = await pdfWin.webContents.executeJavaScript('document.body.scrollHeight');
          if (heightPx > 0) {
            heightInInches = (heightPx / 96) + 0.3; // 96 DPI + 0.3" extra bottom padding
          }
        } catch (measureErr) {
          console.error('[IPC] Failed to measure content height, falling back to 15":', measureErr);
        }

        const pdfBuffer = await pdfWin.webContents.printToPDF({
          printBackground: true,
          preferCSSPageSize: false,
          pageSize: { width: 3.15, height: heightInInches },
          margins: { marginType: 'none' }
        });

        let savedFilePath = null;
        if (savePath && fileName) {
          try {
            if (!fs.existsSync(savePath)) {
              fs.mkdirSync(savePath, { recursive: true });
            }
            const fullPath = path.join(savePath, fileName);
            fs.writeFileSync(fullPath, pdfBuffer);
            savedFilePath = fullPath;
            console.log(`[IPC] PDF saved to: ${fullPath}`);
          } catch (saveErr) {
            console.error('[IPC] Failed to save PDF locally:', saveErr);
          }
        }

        const base64 = pdfBuffer.toString('base64');
        
        // Clean up the temporary file
        if (fs.existsSync(tempHtmlPath)) {
          fs.unlinkSync(tempHtmlPath);
        }

        pdfWin.destroy();
        resolve({ base64, savedFilePath });
      } catch (err) {
        if (fs.existsSync(tempHtmlPath)) {
          try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
        }
        pdfWin.destroy();
        reject(err);
      }
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

let mainWindow = null;
let splashWindow = null;

function createWindow() {
  // Create Splash Screen Window (Fullscreen, Frameless, Transparent for cinematic animation)
  splashWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (!app.isPackaged) {
    splashWindow.loadURL('http://127.0.0.1:5173/splash.html');
  } else {
    splashWindow.loadFile(path.join(__dirname, '../dist/splash.html'));
  }

  splashWindow.once('ready-to-show', () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.show();
    }
  });

  // Create Main Window (keep hidden initially)
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "SaSLoop Master POS",
    icon: path.join(__dirname, isDev ? '../public/logo.png' : '../dist/logo.png'),
    frame: false, // Frameless window to allow custom HTML top bar titlebar
    show: false, // Keep hidden until React app sends 'app-ready'
    backgroundColor: '#0d1117',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Allow ES module loading from file:// protocol
    },
    autoHideMenuBar: true, // Professional look
  });

  mainWindow = win;

  // Redirect all external URL opens (e.g. WhatsApp links) to the system's default browser
  // This prevents the "Update Chrome" error when WhatsApp doesn't recognize Electron's Chromium
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  if (!app.isPackaged) {
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

  // Coordination helper to transition from splash to main window
  let isAppReady = false;
  const showMainApp = () => {
    if (isAppReady) return;
    isAppReady = true;

    // Clear safeguard timer
    if (safeguardTimeout) clearTimeout(safeguardTimeout);

    // Close splash window
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }

    // Show main window
    if (win && !win.isDestroyed()) {
      win.show();
      win.maximize();
    }
  };

  // Safe timeout to force show app if IPC fails
  const safeguardTimeout = setTimeout(() => {
    console.log('[Electron] Safeguard timeout triggered: forcing app ready state.');
    showMainApp();
  }, 8500);

  // Listen for the app-ready event from the React renderer
  ipcMain.once('app-ready', () => {
    console.log('[Electron] Received app-ready signal from React.');
    showMainApp();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
