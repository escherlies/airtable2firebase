// modules
import Airtable from 'airtable'
import _ from 'lodash'
import request from 'request'
import fs from 'fs'
import firebaseAdmin from 'firebase-admin'

// configs
import settings from './settings.json'


// init
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: settings.airtable.apiKey
});

const base = Airtable.base(settings.airtable.base.id)

// init firebase admin
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(settings.firebase.serviceAccount),
    databaseURL: settings.firebase.databaseURL
});
const bucket = firebaseAdmin.storage().bucket(settings.firebase.bucket);


console.log('\n\n\n*** Airtable to Firebase Service *** \n\n\n')

function main() {

    const parseData = array => {
        const clone = _.cloneDeep(array)

        const recursivlyLookForAttatchments = object => {
            if (object.filename && object.size) {
                // upload to firebase
                console.log('Simulated Upload...')
                const url = object.url
                const p = uploadToFirebaseCloudStorage(url)
                console.log(p)

            }
        }


    }

    const uploadToFirebaseCloudStorage = (url, destination = '') => {

        return new Promise((resolve, reject) => {

            const errorHandler = error => {
                reject(error)
            }

            const filename = url.substring(url.lastIndexOf('/') + 1)
            const file = bucket.file(destination + filename)

            let logMessage = ''

            file.exists(function (err, exists) {
                if (err) return errorHandler(err)

                if (!exists || true) {
                    const currentRequest = request
                        .get(url)
                        .on('response', function (response) {

                            logMessage += response.statusCode + ' ' // 200
                            logMessage += response.headers['content-type'] + ' ' // 'image/png'

                            if (response.statusCode === 200) {

                                currentRequest.pipe(file.createWriteStream())
                                    .on('error', errorHandler)
                                    .on('finish', function () {

                                        // The file upload is complete.
                                        console.log(logMessage + 'Finished uploading', filename, 'to /' + destination)
                                        resolve()
                                    })
                            } else {
                                errorHandler('Response error code ' + response.statusCode)
                            }
                        })



                } else {
                    console.log(logMessage + 'File', filename, 'already uploaded')
                    resolve()
                }
            })
        })
    }


    uploadToFirebaseCloudStorage('https://dl.airtable.com/CMsluIDTXCtwIXXD8wro_1.jpg')
        .then(value => console.log(value))
        .catch(err => console.error(err))
}

main()
