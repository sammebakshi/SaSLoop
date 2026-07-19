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
            padding: 0;
            font-family: Arial;
          }
        </style>
      </head>
      <body>
        <h1>Receipt Test</h1>
        <p>Item 1: $10.00</p>
        <p>Item 2: $15.00</p>
        <p>Total: $25.00</p>
      </body>
    </html>
  `;

  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));

  win.webContents.on('did-finish-load', async () => {
    try {
      console.log('Generating PDF with width 3.1496, height 11.811...');
      const pdfBuffer = await win.webContents.printToPDF({
        printBackground: true,
        preferCSSPageSize: false,
        pageSize: { width: 3.1496, height: 11.811 },
        margins: { marginType: 'none' }
      });

      const outPath = path.join(__dirname, 'test_out.pdf');
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
