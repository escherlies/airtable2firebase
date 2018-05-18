import uploadToFirebaseCloudStorage from './uploadToFirebaseCloudStorage'
import _ from 'lodash'
import { isArtableAttachment } from './utils'


const uploadAndAttatchUrls = (array, destination) => {

    return new Promise((resolve, reject) => {

        const promisses = []

        const clone = _.cloneDeep(array)

        const recursivlyLookForAttatchments = (value, route = []) => {

            if (typeof value === 'object') {

                // check if it's an airtable file object
                if (isArtableAttachment(value)) {

                    // upload to firebase
                    const url = value.url
                    const path = destination + '/' + url.substring(url.lastIndexOf('/') + 1)

                    _.set(clone, [...route, 'firebasePath'], path)

                    promisses.push(uploadToFirebaseCloudStorage(url, path))

                }

                // iterate again over every key
                _.forEach(value, (nextValue, key, collection) => {
                    recursivlyLookForAttatchments(nextValue, [...route, key])
                })

            }
        }

        recursivlyLookForAttatchments(clone)
        Promise
            .all(promisses)
            .then(() => resolve(clone))
            .catch(err => reject(err))
    })
}

export default uploadAndAttatchUrls
