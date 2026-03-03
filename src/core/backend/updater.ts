import pkg from 'electron-updater'
const { autoUpdater } = pkg
type UpdateInfo = pkg.UpdateInfo
import { app, BrowserWindow } from 'electron'
import pc from 'picocolors'

/**
 * Configures and initializes the auto-updater.
 * Sends update lifecycle events to the renderer process via IPC.
 */
export function setupAutoUpdater(win: BrowserWindow): void {
    // Allow the updater to work in dev mode (reads dev-app-update.yml)
    autoUpdater.forceDevUpdateConfig = !app.isPackaged
    // Do not auto-download; let the user decide
    autoUpdater.autoDownload = false
    // Auto-install on quit
    autoUpdater.autoInstallOnAppQuit = true

    // --- Event listeners ---

    autoUpdater.on('checking-for-update', () => {
        console.log(pc.cyan('[Updater] Checking for updates...'))
        win.webContents.send('updater:checking-for-update')
    })

    autoUpdater.on('update-available', (info: UpdateInfo) => {
        console.log(pc.green(`[Updater] Update available: v${info.version}`))
        win.webContents.send('updater:update-available', info)
    })

    autoUpdater.on('update-not-available', (info: UpdateInfo) => {
        console.log(pc.yellow('[Updater] No update available.'))
        win.webContents.send('updater:update-not-available', info)
    })

    autoUpdater.on('download-progress', (progress) => {
        console.log(pc.cyan(`[Updater] Download progress: ${progress.percent.toFixed(1)}%`))
        win.webContents.send('updater:download-progress', progress)
    })

    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
        console.log(pc.green('[Updater] Update downloaded. Will install on quit.'))
        win.webContents.send('updater:update-downloaded', info)
    })

    autoUpdater.on('error', (err: Error) => {
        console.error(pc.red(`[Updater] Error: ${err.message}`))
        win.webContents.send('updater:error', err.message)
    })

    // Perform an initial check after a short delay
    setTimeout(() => {
        autoUpdater.checkForUpdates().catch((err) => {
            console.error(pc.red(`[Updater] Failed to check for updates: ${err.message}`))
        })
    }, 3000)
}

/**
 * Manually triggers a check for updates.
 */
export function checkForUpdates(): void {
    autoUpdater.checkForUpdates().catch((err) => {
        console.error(pc.red(`[Updater] Failed to check for updates: ${err.message}`))
    })
}

/**
 * Starts downloading the available update.
 */
export function downloadUpdate(): void {
    autoUpdater.downloadUpdate().catch((err) => {
        console.error(pc.red(`[Updater] Failed to download update: ${err.message}`))
    })
}

/**
 * Quits the app and installs the downloaded update.
 */
export function quitAndInstall(): void {
    autoUpdater.quitAndInstall()
}
