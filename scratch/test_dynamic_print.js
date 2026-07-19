const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false });
  const html = `
    <html>
      <head>
        <style>
          body {
            width: 80mm;
            margin: 0;
            padding: 8mm 6mm;
            box-sizing: border-box;
            font-family: Arial;
            background: white;
          }
          h1 { margin-top: 0; font-size: 16px; text-align: center; }
          p { margin: 4px 0; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>SHAHE TEHZEEB RESTAURANT</h1>
        <p>Item 1: COCA COLA TIN x 2 = $80.00</p>
        <p>Subtotal: $80.00</p>
        <p>Grand Total: $80.00</p>
        <p style="text-align: center; margin-top: 20px;">THANK YOU! VISIT AGAIN</p>
      </body>
    </html>
  `;

  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  win.webContents.on('did-finish-load', async () => {
    try {
      // Measure scroll height of the body in pixels
      const heightPx = await win.webContents.executeJavaScript('document.body.scrollHeight');
      console.log('Measured scrollHeight in pixels:', heightPx);
      
      // Convert pixels to inches (default DPI in Electron/Chromium is 96)
      // Add a small padding (say 0.2 inches) to make the bottom margin look even
      const widthInInches = 3.15; // 80mm
      const heightInInches = (heightPx / 96) + 0.25; 
      console.log(`Calculated PDF page size: ${widthInInches} x ${heightInInches} inches`);

      const pdfBuffer = await win.webContents.printToPDF({
        printBackground: true,
        preferCSSPageSize: false,
        pageSize: { width: widthInInches, height: heightInInches },
        margins: { marginType: 'none' }
      });

      const outPath = path.join(__dirname, 'test_dynamic.pdf');
      fs.writeFileSync(outPath, pdfBuffer);
      console.log('PDF written. Parsing MediaBox...');
      
      const content = fs.readFileSync(outPath, 'utf8');
      const matches = content.match(/\/MediaBox\s*\[[^\]]+\]/g);
      console.log('Found MediaBox entries:', matches);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      app.quit();
    }
  });
});
