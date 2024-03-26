const { contextBridge, ipcRenderer } = require('electron')
const sql = require('sql.js')

contextBridge.exposeInMainWorld(
  'api', {
    runSql: (sqlQuery) => {
      // Creează o bază de date nouă
      const db = new sql.Database()
      
      // Rulează interogarea SQL
      const result = db.exec(sqlQuery)
      
      // Închide baza de date
      db.close()
      
      // Întoarce rezultatul
      return result
    },
    send: (channel, data) => {
      // valid channels
      let validChannels = ["salveazaBazaDeDate"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    }
  }
)
