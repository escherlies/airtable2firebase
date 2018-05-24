import { firebaseBucket } from './bases'
import request from 'request'

const uploadToFirebaseCloudStorage = (url, path, route) => {

    return new Promise((resolve, reject) => {

        const errorHandler = error => {
            reject(error)
        }

        const file = firebaseBucket.file(path)

        let logMessage = ''

        file.exists(function (err, exists) {
            if (err) return errorHandler(err)

            if (!exists) {
                const currentRequest = request
                    .get(url)
                    .on('response', function (response) {

                        logMessage += response.statusCode + ' ' // 200
                        logMessage += response.headers['content-type'] + ' ' // 'image/png'

                        if (response.statusCode === 200) {

                            currentRequest.pipe(file.createWriteStream({ predefinedAcl: 'publicRead' }))
                                .on('error', errorHandler)
                                .on('finish', () => {

                                    // get download link
                                    file.getMetadata()
                                        .then(data => {
                                            const metadata = data[0];
                                            const apiResponse = data[1];
                                            const mediaLink = metadata.mediaLink
                                            resolve({ mediaLink, route })

                                        }).catch(errorHandler)

                                })
                        } else {
                            errorHandler('Response error code ' + response.statusCode)
                        }
                    })



            } else {
                // get download link
                file.getMetadata()
                    .then(data => {
                        const metadata = data[0];
                        const apiResponse = data[1];
                        const mediaLink = metadata.mediaLink
                        resolve({ mediaLink, route })

                    }).catch(errorHandler)
            }
        })
    })
}



export default uploadToFirebaseCloudStorage
