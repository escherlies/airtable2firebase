// modules
import _ from 'lodash'

//
import { airtableBase } from './bases'
import uploadToFirebaseCloudStorage from './uploader'

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

    swapUrls(testdata, tableName)
}

export default airtable2firebase
