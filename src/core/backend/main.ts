import 'reflect-metadata'
import { app, BrowserWindow, ipcMain } from 'electron'
import { IEventPort, BaseModule } from '../../shared/domain/ports/module.port'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pc from 'picocolors'
import { initDatabase } from './database'
import { setupAutoUpdater, checkForUpdates, downloadUpdate, quitAndInstall } from './updater'
import { backendModules } from '../registry/modules.backend'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
    win = new BrowserWindow({
        titleBarStyle: 'hidden',
        show: false,
        titleBarOverlay: {
            color: '#0f172a',
            symbolColor: '#94a3b8',
            height: 35
        },
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    win.maximize()
    win.show()

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(async () => {
    await initDatabase();

    const modules: BaseModule[] = backendModules.map(reg => reg.create());

    modules.forEach(mod => {
        console.log(pc.cyan("Found module ") + pc.bold(mod.prefix));
    });
    console.log(pc.cyan(""));
    // Register handlers (mandatory for all BaseModules)
    modules.forEach(mod => {
        console.log(pc.yellow("Registering module ") + pc.bold(mod.prefix));
        Object.entries(mod.getHandlers()).forEach(([name, fn]) => {
            ipcMain.handle(`${mod.prefix}:${name}`, (_, payload) => fn(payload));
            console.log('- ' + pc.yellow("handler ") + pc.bold(`${mod.prefix}:${name}`));
        });
        console.log(pc.green("Registered module ") + pc.bold(mod.prefix));
        console.log(pc.cyan(""));
    });

    createWindow();

    // Setup optional events
    if (win) {
        modules.forEach(mod => {
            if ('setupEvents' in mod) {
                (mod as unknown as IEventPort).setupEvents(win!);
            }
        });

        // --- Auto-Updater ---
        setupAutoUpdater(win);
    }

    // IPC handlers for manual update control from the renderer
    ipcMain.handle('updater:check', () => checkForUpdates());
    ipcMain.handle('updater:download', () => downloadUpdate());
    ipcMain.handle('updater:quit-and-install', () => quitAndInstall());
})
