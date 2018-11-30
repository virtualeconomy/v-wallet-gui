const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let url
if (process.env.NODE_ENV === 'DEV') {
    url = 'http://localhost:8080/'
} else {
    url = `file://${process.cwd()}/dist/index.html`
}

function createWindow() {
    let window = new BrowserWindow({
        title: 'VSYS Client',
        height: 600,
        width: 1000,
        minHeight: 600,
        minWidth: 800,
        minimizable: true
    })
    window.loadURL(url)
    window.on('close', () => {
        window = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (window === null) {
        createWindow()
    }
})
