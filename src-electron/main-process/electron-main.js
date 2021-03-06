/**
 *
 *  Wallet Main
 *
 *  All Network
 *
 *  All wallet and key mangement
 *
 *
 * @type {string}
 */

const TAG = ' | ELECTRON-MAIN | '
const log = require('electron-log');
import { app, Menu, Tray, BrowserWindow, nativeTheme, ipcMain, Notification, shell } from 'electron'
//import {checkConfigs, getConfig, innitConfig, updateConfig} from "@pioneer-platform/pioneer-config";
const { menubar } = require('menubar');
const CryptoJS = require("crypto-js")
const bip39 = require(`bip39`)
//TODO this path doesnt work on build
//const path = require('path');
//const iconPath = path.join(__dirname, 'menu-icon-large.png');
//TODO why this no work?
//const iconPath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA6CAYAAADspTpvAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAABqsAAAarAFUFtHyAAAAB3RJTUUH5QEPFDos4wCgQQAADhlJREFUaN7lmnt0VVV6wH97n3PPfeTmJrlJyIuQkJhAIExhEKmKDg8V6Yzg0orS0Y6Paq12bDt1uWAElHFG65rWTnVcXer8oSB11Wk701brqmWqAgU0+EBJgPAQCAnkTZL7vvecr38khNyQaHjFjv3Wuo/9/n57f+fbr2MwzpJdDi4vUzMmYPiChKPd49u+Hm/gvKng8nNZ1iTKsyePd+tfAfD+t0DBHG8u1RkF/w+AlcLr2Ey3/Ez1F0DWJPX1BgaCTooyl5fqE58oI1g5vo2bXwHwRMcm37CYnDVJAsko4+q2vooRrhSHDGVSbHoo8GSNb+NfBfBUBK01OdpFmeX/egMbwNSBlj3aRbU3F2D8HNd4AweACgClQBvU3P9DKPrm+Ckw3sAFQMlg4wZVP1yCN7NExk2Bi+qls7KycLvdqq+vL8u27eJUKrXEcZwgIIAShyldjcb1PZ/r3R6PcTw/Pz8UjUbp6Oj47QEOBAIEAgHa2toKQqHQ5X19fdeKyGVAmYhkAdapvCKUJsL2P9jidDnx1IHm5uatWuu3vF7vh/F4PDpjxgx27dp10eDPSyZNmgSAZVn5hmH8QCn1CRCnfzTTPv5C5MpHkKvXILlT0tOUUj1a6381TfM7Pp/PY1kWCxcu/Krx0sXn85GVlWWYpnm9UmoLkBoJdDjw/HVI6RUj51FK9WmtX3W5XLUAmZmZF0TX83JaIoJlWTiOkxkKhR61bXujiMyjf/r5clHgyxu1br/jON9NpVK/MgxjBWB4PJ7zBh6bYiPI2rVrue6661BK5SWTyWccx/k+kDE8n2maXHLJJUydOpXjx4/jOA7uTE3hTFAm+D1ZTPbPJRKOEolERmoqCCxKpVJ9Xq/3I621k0qlzhv8rMWyLDweT7bW+mXAYZhJulwumTdvnrz00kvS3Nws69evF621ABIoNmTeSiVXP4bc+FdFsvfwJ7Lrk12yevVqqaysHM3Ee0zTvK+kpERlZGScm9LnKj6fj0Ag4DIM4ynAHq5cWVmZPPvss9LZ2SmnZO3atYPpWcWGzFup5VuPIdes88j2hv8UERHHcWTfvn3ywAMPiN/vHwm63eVyLYX+KW9cJBgMAmCa5m1Kqb7hSl155ZWyY8cOGSqpVEqWL18+IvDVa5DXNz+Xlj8ej8vLL78sRUVFI0HvdrvdU0zT5Nprr734wKZpYllWhVLq0+HKzJ8/Xz7++CNJJONpAN3d3TJ79uwRgeetQf76Xx6Q4RIOh+WV9a/IhAkTzoA2DOMXwWDQOhfPfVZe2u/3s2DBApVKpe4TkRlD02pqanjuuefwZnh44vm/4P29bxNPRAFobW2lpaXldOZhe4VjXfuJJ2IA9Jzs4Zf/9Do/fu4RrrluPuvWrcPr9abldxznlkgkMj8ajVJdXX3xgBOJBJs3b75ERJYPjff5fKxZs4ba2loqyqto+zzKn6y7iR+9fjt1jZtoPLCP7u6h+/zTxEpBW+8RDh87wPpX1nPjTct45Gd3UFQVoLhgEnfeeScrVqxI00NEArZt311ZWWnFYrGzHOMxSmFhIQCmaf45w0zs5ptvlkgkMmiO2/5nuxRPzpeptyA3/rRA7nt4hSj0aZMuMU8/w48h33kyKH9w7zJxWZYUzUVufrJCjrTuHayvvr5eKioqhpt1e3Z29qV+/9ltqMc8wolEgry8PJ+ILBkan5GRwT333JNmdnMuu5RvL7qRA29C06chPtu9C8FJq08N+Y0k+2g4UkfJFUkqr4HrZ3+XSROmDOadNm3aGaPsOE5eIpG4JhQKMWvWrAsPHI1GiUQi5SLyjaHxM2fO5PLLLx8M27ZNLBVm6W3XcdXiWSR7TJrbPx8R9lQgEUsSTvZQXlrBNzKXMmfSDaSS6YuLZcuWkZubOxgWERKJxJUVFRXu9vb2MQOPebeUSCQwDHOaiKQtBmfNmUF7+DAfHm7kSPseDrc30NJ9gM5wC65v9hB0YvgqhUgEOvakIysFdgKObIbmHRGO6GPsDvTy3oa7KCsrY8qUKdTU1FBdXU12djaTJ0+ms7NzKHRNZ2fnBKBprBxferaSW6WIdKBm36tdn27gcQd7lTcIGfn96+DS6jxcfodwvIekYw+CqIHfU+F4CA68Be31kF3iYsYfOqBsPn8Hmj8AsUdRUCm8Xi+5ubn09PTQ29s7mKa17nO73TdHo9H/pn8BNHbgFzvg7/4UXB6llSGZhpsCw0W5NpmiTaZpgyl2khnKIM90gzb6SzsDi0r1JV2nFCTC/TcPyW4XNb/vcGSbTUsdiMO5ioA6BLIXaAT2APuBo0A7EIZ056GUJs/KoCi7nGkZhUzzZDHV5aPSsChWJkGlcav0FgZ9pcjpyMH/Q/vSEUT6gUT6RysRUnQ2aFyZDh17nf4OS6s8PSyMMV0GvhVRBZ1K06xMDmqTfUqzz45zSGnaTKVx2wkCvS0U9p1gktiUik2h45CNYA2FGrExGU0hGUyXU5MJguGCnAoHZQgz7gClh5STYZ06rF4Zta2BoINybHx2Am8qSjAZpjDeR0m0iwmhE3hSMZUcbogK8AH5QBlQDUyj/2h1MlA6kH5OogyYNA9yyjR7fiVMvEKY+LvDoEct3P85pbA4YCfBThCz43SlYrSkYhxMRtibDLMvEVIHYz00R9ro6juhY8oQEds5w0sL/XYfBg4D7w3Eu5VSWaZpPppMJh8aWiAjI4NkMkkikfhifTVMnAtlV0OoBVJxOPwOIIqSudIPPUwRkQEfYYMWk2QIQh0pIp0Q6YD4SRW1fMZfikq93XNUdcZ7VR84NmQDJ4fUZg86xbFOS3GgzTTNnalUSkRk0DLuvvtulixZQn19PQ0NDTQ2NnK06ShdHV3EYjFsx0ZpKL4UyuaDdvXPodA/JR1+FxSa4rlOP7RtoG03GUaQoG8ixVmVlOXXUJBdxtM/+lt2b/3odCcq1elxW2+DdTAeiwwxk5Ojgox5HvZ4PGit9ymlekQk+1R8c3MzixYtYsmSJYgI4XCYjvYOPt5dx7+9+yq7PtpNV7yJid9KYlicYbp2Qjj8HhgpP4X5JUyvmMPypbdTVlJFMCuPDJ8fw9Ts37+f40c708oqxUGP131CRIjGImOgOIuVlsfjwbKsA0qpA0Pjt23bRkNDw6kex+/3Uz65nB7fXpr8bxOijYk12bi8jP6c2iY5wSAH9xzln3+xCYl5KC+tIBAIYJj9Km7atIljx9LXF1rr7d3d3WHLshirjBk4IyOD7u7uLsMwfjM0/sSJE7z22muDZgpwtG0/b9a9Qv1bMZo/EMrzalFf0FRWIItZc6cx8Zoo8awTvPDCC8Tj8cH0jo4ONm7ciDNkDlNKhV0u128sy6Ktre3CAx87dgy3241hGL/WWqfZ1oYNG9i+fftg+M3tG9j264MEeqtZ/ehqbvm976FxjVp3UVEhdy1ZyfJF93P5igI+OPQfbN26dTB948aNvP/++2llTNP8MBgM1g1dX19wKSgooLy83DJNcz3DtoiLFy+WtrY2OdpyUO74s2/Lj598Qg4dOiQiIodaGmTZUwVy9dr+s+hZdysxLDVYdunSpZJIJCRlp2Tf8Z3y5Mb75fFnfiCJREK2bNkipaWlw495kn6//48AbrjhhosHXF1djWVZeL3euVrr48OUkAcffFD2H2yUpmNHxXGcwf1sb6hb7vn5pXLVKMCrVq1KPwNzktLc/rnU7ayTOXPmnHHEY1nWO6WlpblFRUVnzXBWJx6NjY34/X5mz579gWmaf6+UGnyoRIQXX3yRv/npM3jcXtSQxXWGN0BpcMoIy0/QWlNbW5sWZyiT1qZuHvr+Q9TV1Q3P3+n1ep9qamrqXLBgwcUb3aGSm5tLQUFBrmVZbwzvfa21LF68WHbs2CG2bQ+O2iubnpKr1pw5wtnZ2VJXVzeYLxKJyMaNG6WqqmqkE8ukx+N5dP78+bq8vHx8YAFWrlyJaZrk5ORMNQxjx3DFACkuLpZVq1ZJQ0ODiCOyZfe/y8LHrTOAp0+fLq2trRIOh2XTpk1y6623is/nGwnWdrlcLxQWFvrPx1Gd87sGFRUVHDp0CK/X+zvxePxFx3EuO6NypSgpKWHhgoVU1pawJfRzUmYfPUcUn77av+iora3lpptuYuvWrezcuTNtvztEbNM01wcCgYdTqVTXKHkuvhQU9L9K53a7p2it32CEW4hTH9OtZOZdShY8gcy8CzFcp53daGUG0kOmaT6dmZmZ5fF40ub7c5Hzuj1sbW2lpqYG27b3ud3u75mm+ROl1IgHTKm4EGkfuv8b+PsFAEqpvaZp/rHX612TSqV6YrFYmjM8Fznn28NT0tHRgeM4eDyeqMfj2ew4zlb6bxEnAmn3m55sCFZB7CS0fTbqSYdorY9qrV8yTfPhZDL5ns/ns0Oh0PmqemGAT0kikaCmpkY6OzubvF7vG8C7QLdSyjfQAZbpRk2YDvE+aPv0NLBSytZadxiGscPlcj3vdrtX5+bm/tIwjM5oNMpFO2y/kFJcXExVVZXy+Xx5lmVdYSjz3pxy4/l5K+mdeReiXYhC7XG5XGvcbvdyv99fm5+f7wO4/fbbL5pe4/ZGWO1tgCInp4L/6jvO7M82gJ3kaWDleOkA4/ieVrhVUf+PqkccGgeclgPsHk/YcQXuaYLFPxNHbHYPAPcC+762wF0HhL5j4DjUOw4pFMc5ixuD3zpg6PfOOBxwkvQog0NA19cbuAeUQYsdp0mb7MmpJHH+tf4fBg61Ksrnq95klHrDoj52crxxL+DCYyyiteKTl0U8ORQmQnwGHEuGv8bA0e7+G0c7QdxO0IQQHm/g/wUug9jE3TsB5AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wMS0xNVQyMDo1ODo0NC0wNTowMCPFheIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDEtMTVUMjA6NTg6NDQtMDU6MDBSmD1eAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAABN0RVh0VGl0bGUAR3JlZW4gQ29tcGFzc8/wTcEAAAAASUVORK5CYII="
let wait = require('wait-promise');
let sleep = wait.sleep;
//internal
import {
  onStart,
  onLogin,
  startNetwork,
  attemptPair,
  checkPioneerUrls,
  updateServerSelection,
  createWallet,
  onAttemptCreateUsername,
  approveTransaction,
  refreshPioneer,
  setContext,
  continueSetup,
  startHardware,
  getUsbDevices,
  onPairKeepKey,
  buildTransaction,
  broadcastTransaction,
  cancelTransaction
} from './app'


// const pioneer = require("@pioneer-platform/pioneer-client")
const Hardware = require("@pioneer-platform/pioneer-hardware")


//Globals
let IS_APP_STARTED = false
let URL_PIONEER_SPEC
const WALLETS = []
const APPS = []
let KEEPKEY
let PIONEER_SERVER_PROCESS
let TEMP_SEED = "" //only used in setup

//feature flags
let featureKeepkey = process.env['KEEPKEY_FEATURE']
let featureSoftwareCreate = process.env['CREATE_SOFTWARE_FEATURE']
let featurePasswordless = process.env['PASSWORDLESS_FEATURE']
let featureInsecurePassword = process.env['INSECURE_PASSWORD']

/*
      MenuBar

        - Osx
 */

/*
    Electron Settings
 */

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
// let approveWindow

//TODO :pray: someday menubar again?
// function createPreviewDashboard(){
//   previewWindow = new BrowserWindow({
//     width: 1000,
//     height: 600,
//     useContentSize: true,
//     webPreferences: {
//       // Change from /quasar.conf.js > electron > nodeIntegration;
//       // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
//       nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
//       nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
//
//       // More info: /quasar-cli/developing-electron-apps/electron-preload-script
//       // preload: path.resolve(__dirname, 'electron-preload.js')
//     }
//   })
//   return previewWindow
// }

function bringWindowToFront(){
  try{

    //
    mainWindow.setAlwaysOnTop(true)

  }catch(e){
    log.error(e)
  }
}

function releaseWindowFromTop(){
  try{

    //
    mainWindow.setAlwaysOnTop(false)

  }catch(e){
    log.error(e)
  }
}

function createWindow () {
  /**
   * Menu Bar
   */
  //TODO crash (only on build) image could not be created from "blabla" menu-icon-large.png
  log.info("Creating window!")
  //TODO why this no work?
  // previewWindow = createPreviewDashboard()

  // const tray = new Tray(iconPath);
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Open App', type: 'radio', click(){
  //       console.log("Open App was clicked!")
  //     }
  //   }
  // ])
  // tray.setToolTip('This is my application.')
  // tray.setContextMenu(contextMenu)

  //TODO focus on event https://stackoverflow.com/questions/53702044/how-do-i-bring-a-window-to-the-front-without-switching-apps-in-electron/62942825


  /**
   * Initial window options
   *
   * more options: https://www.electronjs.org/docs/api/browser-window
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    //TODO make toggle
    //remember last setting?
    //alwaysOnTop: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

// This will catch clicks on links such as <a href="foobar://abc=1">open in foobar</a>
app.on('open-url', function (event, data) {
  event.preventDefault();
  //TODO if invocation then open invocation page and set context
  log.info("Got data: ",data)
  createWindow()
});

app.setAsDefaultProtocolClient('invocation');
// Export so you can access it from the renderer thread


app.on('ready', createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

//openLink
ipcMain.on('openLink', async (event, data) => {
  const tag = TAG + ' | cancelTransaction | '
  try {
    log.info(tag,"data: ",data)

    if(data.url){
      shell.openExternal(data.url)
    }


  } catch (e) {
    console.error(tag, e)
  }
})

//cancelTransaction
ipcMain.on('cancelTransaction', async (event, data) => {
  const tag = TAG + ' | cancelTransaction | '
  try {
    log.info(tag,"checkpoint0")
    let resultCancel = await cancelTransaction(event, data)
    log.info(tag,"resultCancel: ",resultCancel)

  } catch (e) {
    console.error(tag, e)
  }
})

//setContext
ipcMain.on('setContext', async (event, data) => {
  const tag = TAG + ' | setContext | '
  try {
    log.info(tag,"checkpoint0")
    let setContextResult = await setContext(event, data)
    log.info(tag,"setContextResult: ",setContextResult)

  } catch (e) {
    console.error(tag, e)
  }
})

//onPairKeepKey
ipcMain.on('onPairKeepKey', async (event, data) => {
  const tag = TAG + ' | onPairKeepKey | '
  try {
    log.info(tag,"checkpoint0")
    let pairKeepKeyResult = await onPairKeepKey(event, data)
    log.info(tag,"pairKeepKeyResult: ",pairKeepKeyResult)
    if(pairKeepKeyResult){
      event.sender.send('pairKeepKey', {success:true})
    }
  } catch (e) {
    console.error(tag, e)
  }
})

//onAttemptCreateUsername
ipcMain.on('onAttemptCreateUsername', async (event, data) => {
  const tag = TAG + ' | onAttemptCreateUsername | '
  try {
    let createUserResult = await onAttemptCreateUsername(event, data)
    log.info(tag,"createUserResult: ",createUserResult)
  } catch (e) {
    console.error(tag, e)
  }
})

//continueSetup
//Note this is designed to be called over and over untill setup complete
ipcMain.on('continueSetup', async (event, data) => {
  const tag = TAG + ' | continueSetup | '
  try {

    let resultSetup = await continueSetup(event, data)
    log.info(tag,"resultSetup: ",resultSetup)
    if(resultSetup.setup) {
      log.info(tag,"Setup complete starting App")
      event.sender.send('navigation',{ dialog: 'Startup', action: 'open'})
      //if app !started
      if(!IS_APP_STARTED){
        IS_APP_STARTED = true
        let startResult = await onStartMain(event, data)
        log.info(tag,"startResult: ",startResult)
      } else {
        log.error(tag,"Attempting to start app after already started")
      }
    } else {
      log.error("Failed to continue setup!")
    }

  } catch (e) {
    console.error(tag, e)
  }
})

//getUsbDevices
ipcMain.on('getUsbDevices', async (event, data) => {
  const tag = TAG + ' | getUsbDevices | '
  try {
    let getUsbDevicesResult = await getUsbDevices(event, data)
    log.info(tag,"getUsbDevicesResult: ",getUsbDevicesResult)
  } catch (e) {
    console.error(tag, e)
  }
})

/*
    refreshPioneer

 */

ipcMain.on('refreshPioneer', async (event, data) => {
  const tag = TAG + ' | refreshPioneer | '
  try {
    //if app !started
    if(!IS_APP_STARTED){
      IS_APP_STARTED = true
      onStartMain(event, data)
    }
    let resultRefresh = await refreshPioneer(event, data)
    log.info(tag,"resultRefresh: ",resultRefresh)
  } catch (e) {
    console.error(tag, e)
  }
})

/*
    refreshPioneer

 */

ipcMain.on('startHardware', async (event, data) => {
  const tag = TAG + ' | startHardware | '
  try {
    log.info(tag,"Checkpoint -1")
    let resultStartHardware = await startHardware(event, data)
    //TODO why this null??? :(
    log.info(tag,"resultStartHardware: ",resultStartHardware)
  } catch (e) {
    console.error(tag, e)
  }
})

/*
    App Start

 */

let onStartMain = async function(event, data){
  const tag = TAG + ' | onStartMain | '
  try{
    let onStartResult = await onStart(event,data)
    log.info(tag,"onStartResult: ",onStartResult)

    //on on invocations add to queue
    onStartResult.events.on('message', async (request) => {
      log.info(tag,"**** message MAIN: ", request)
      if(!request.invocationId) throw Error("102: invalid invocation!")
      switch(request.type) {
        case 'swap':
          break;
        case 'approve':
          break;
        case 'transfer':
          //open invocation window
          event.sender.send('navigation',{ dialog: 'Invocation', action: 'open'})
          //set invocationConext to invocationId
          event.sender.send('setInvocationContext',{ invocationId:request.invocationId})
          bringWindowToFront()
          break;
        case 'context':
          break;
        default:
          log.error("Unknown event: "+request.type)
      }
    })
    event.sender.send('setContext',{context:onStartResult.context})
    return onStartResult
  }catch(e){
    throw Error("Failed to start!")
  }
}

ipcMain.on('onStart', async (event, data) => {
  const tag = TAG + ' | onStart | '
  try {
    log.info(tag,"checkpoint 0")
    onStartMain(event, data)

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('updateContext', async (event, data) => {
  const tag = TAG + ' | updateContext | '
  try {

    //setContext(event, data)

  } catch (e) {
    console.error(tag, e)
  }
})

//onTryPin
ipcMain.on('onTryPin', async (event, data) => {
  const tag = TAG + ' | onTryPin | '
  try {
    log.info(tag,"trying pin! ",data.pin)
    //try pin
    Hardware.enterPin(data.pin)
    //if wrong?

  } catch (e) {
    console.error(tag, e)
  }
})

//updateServerSelection
ipcMain.on('updateServerSelection', async (event, data) => {
  const tag = TAG + ' | updateServerSelection | '
  try {
    //log.info(tag,"updateServerSelection",data)
    //
    let result = await updateServerSelection(event, data)
    log.info(tag,"result",result)

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('checkPioneerUrls', async (event, data) => {
  const tag = TAG + ' | checkPioneerUrls | '
  try {
    //log.info(tag,"checkPioneerUrls",data)
    //
    let result = checkPioneerUrls(event, data)
    log.info(tag,"result",result)
  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('startNetwork', async (event, data) => {
  const tag = TAG + ' | startNetwork | '
  try {
    log.info(tag,"startNetwork",data)

    //result
    let result = startNetwork(event, data)
    log.info(tag,"result",result)

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('attemptPair', async (event, data) => {
  const tag = TAG + ' | attemptPair | '
  try {
    log.info(tag,"data: ",data)
    let result = await attemptPair(event,data)

    if(result.user){
      //save pairing as app
      event.sender.send('pairApp', {url: result.url, success: true, trusted:result.trusted})
    } else {
      event.sender.send('pairApp', {error:true,errorMsg:result})
    }
    log.info(tag,"attemptPair result: ",result)
  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('setMnemonic', async (event, data) => {
  const tag = TAG + ' | setMnemonic | '
  try {
    log.info(tag,"data: ",data)

    TEMP_SEED = data.seed

  } catch (e) {
    console.error(tag, e)
  }
})



ipcMain.on('buildTransaction', async (event, data) => {
  const tag = TAG + ' | buildTransaction | '
  try {

    //context
    //invocationId
    //approveWindow = null

    let transferUnSigned = await buildTransaction(event, data)
    log.info(tag,"transferUnSigned: ",transferUnSigned)

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('approveTransaction', async (event, data) => {
  const tag = TAG + ' | approveTransaction | '
  try {

    //context
    //invocationId
    //approveWindow = null

    let resultApprove = await approveTransaction(event, data)
    log.info(tag,"resultApprove: ",resultApprove)

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('broadcastTransaction', async (event, data) => {
  const tag = TAG + ' | broadcastTransaction | '
  try {

    //context
    //invocationId
    //approveWindow = null

    let resultBroadcast = await broadcastTransaction(event, data)
    log.info(tag,"resultBroadcast: ",resultBroadcast)

  } catch (e) {
    console.error(tag, e)
  }
})

function standardRandomBytesFunc(size) {
  /* istanbul ignore if: not testable on node */
  return CryptoJS.lib.WordArray.random(size).toString()
}

ipcMain.on('createWallet', async (event, data) => {
  const tag = TAG + ' | createWallet | '
  try {
      log.info(tag,"data: ",data)
      if(!TEMP_SEED) {
        //create
        if(featureSoftwareCreate){
          log.info(tag,"featureSoftwareCreate TRUE")
          let randomBytesFunc = standardRandomBytesFunc
          const randomBytes = Buffer.from(randomBytesFunc(16), `hex`)
          if (randomBytes.length !== 16) throw Error(`Entropy has incorrect length`)
          let mnemonic = bip39.entropyToMnemonic(randomBytes.toString(`hex`))
          data.mnemonic = mnemonic
          TEMP_SEED = mnemonic
        }else{
          throw Error("unhandled action featureSoftwareCreate: "+featureSoftwareCreate)
        }
      }
      data.mnemonic = TEMP_SEED

      let result = await createWallet(event,data)
      log.info(tag,"createWallet result: ",result)

      //f it, send it
      if(result.success){
        event.sender.send('navigation',{ dialog: 'Startup', action: 'open'})
      } else {
        event.sender.send('errors', {dialog: 'Connect', action: 'create',error:result.error})
      }

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('checkDevices', async (event, data) => {
  const tag = TAG + ' | checkDevices | '
  try {
    //
    log.info(tag,"checkDevices: ")

  } catch (e) {
    console.error(tag, e)
  }
})

ipcMain.on('onPairKeepkey', async (event, data) => {
  const tag = TAG + ' | onPairKeepkey | '
  try {
    //pair keepkey
    log.info(tag," pair device: ",data.deviceId)

    let result = await onPairKeepkey(data)
    log.info(tag," result: ",result)

    //if success
    //event.sender.send('navigation', {dialog: 'SetupKeepkey', action: 'close'})

  } catch (e) {
    console.error(tag, e)
  }
})

