// modules
import _ from 'lodash'

//
import { airtableBase } from './bases'
import uploadToFirebaseCloudStorage from './uploader'
import { isArtableAttachment } from './utils'

import { testdata } from '../testdata'


console.log('\n\n\n*** Airtable to Firebase Service *** \n\n\n')

const airtable2firebase = () => {

    const tableName = 'Education'
    // airtableBase(tableName).select({
    //   maxRecords: 1,
    //   view: 'Grid view'
    // }).firstPage(function (err, records) {

    //   if (err) {
    //     console.error(err);
    //     return
    //   }


    //   const table = records.map(record => record._rawJson);

    //   console.log(table)

    // })

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

    uploadAndAttatchUrls(testdata, tableName)
        .then(data => {
            console.log(JSON.stringify(data, null, 2))

        })
        .catch(err => console.log(err))
}

export default airtable2firebase
