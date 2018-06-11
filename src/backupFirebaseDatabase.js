import fs from 'fs'
import { firebaseDatabase } from './bases'
import { resolve } from 'path';
import { getDateTime } from './utils';

const backupFirebaseDatabase = (ref) => {

    return new Promise((resolve, reject) => {

        firebaseDatabase.ref().once('value').then(snap => {
            const data = snap.val()

            if (data) {
                // check wether backups folder exist
                if (!fs.existsSync('./backups')) fs.mkdirSync('./backups')

                const path = `./backups/${getDateTime()}.json`

                // check if theres a backup from today
                if (fs.existsSync(path)) return resolve()

                console.log('Creating Backup for today')
                fs.writeFileSync(path, JSON.stringify(data, null, 2))
                return resolve()
            }

            return resolve()
        })
    })
}

export default backupFirebaseDatabase

