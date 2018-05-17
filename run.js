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


    const uploadToFirebaseCloudStorage = (url, destination = '') => {

        return new Promise((resolve, reject) => {

            const errorHandler = error => {
                reject(error)
            }

            const filename = url.substring(url.lastIndexOf('/') + 1)
            const path = destination + filename
            const file = bucket.file(path)

            let logMessage = ''

            file.exists(function (err, exists) {
                if (err) return errorHandler(err)

                if (!exists || true) { // TODO-PROD: Remove True
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
                                        resolve(path)
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

    const isArtableAttachment = (object, type) => {

        const checkProperties = properties => _.indexOf(_.map(properties, property => _.has(object, property)), false) === -1

        switch (type) {
            case "file":
                return checkProperties(["id", "url", "filename", "size", "type"])
            case "thumbnail":
                return checkProperties(["url", "width", "height"])
            default:
                return false
        }
    }


    const swapUrls = (array, destination) => {

        const clone = _.cloneDeep(array)

        const recursivlyLookForAttatchments = (value, route = []) => {

            if (typeof value === 'object') {

                // check if it's an airtable file object
                if (isArtableAttachment(value, 'file') || isArtableAttachment(value, 'thumbnail')) {

                    // upload to firebase
                    const url = value.url
                    uploadToFirebaseCloudStorage(url, destination)
                        .then(path => {
                            _.set(clone, [...route, 'firebasePath'], path)
                        })
                        .catch(err => console.error(err))
                }

                // iterate again over every key
                _.forEach(value, (nextValue, key, collection) => {
                    recursivlyLookForAttatchments(nextValue, [...route, key])
                })

            }
        }

        recursivlyLookForAttatchments(clone)

        setTimeout(() => console.log(clone), 5000
        )
    }


    // uploadToFirebaseCloudStorage('https://dl.airtable.com/CMsluIDTXCtwIXXD8wro_1.jpg')
    //     .then(path => console.log(path))
    //     .catch(err => console.error(err))
}

main()
