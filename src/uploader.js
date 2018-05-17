import { firebaseBucket } from './bases'
import request from 'request'

const uploadToFirebaseCloudStorage = (url, destination = '') => {

    return new Promise((resolve, reject) => {

        const errorHandler = error => {
            reject(error)
        }

        const filename = url.substring(url.lastIndexOf('/') + 1)
        const path = destination + filename
        const file = firebaseBucket.file(path)

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

export default uploadToFirebaseCloudStorage
