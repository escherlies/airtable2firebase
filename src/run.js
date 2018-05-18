// modules
import _ from 'lodash'

//
import { airtableBase } from './bases'

import uploadAndAttatchUrls from './uploadAndAttatchUrls'
import uploadToFirebaseDatabase from './uploadToFirebaseDatabase'

import { testdata } from '../testdata'


console.log('\n\n\n*** Airtable to Firebase Service *** \n\n\n')

const airtable2firebase = (...args) => {

    _.forEach(args, tableName => {

        console.log(`** Processing table: ${tableName} **\n`)


        airtableBase(tableName)
            .select({
                maxRecords: 1,
                view: 'Main'
            })
            .firstPage((err, records) => {

                if (err) { console.error(err); return }

                const table = records.map(record => record._rawJson);

                uploadAndAttatchUrls(table, tableName)
                    .then(data => {

                        // console.log(JSON.stringify(data, null, 2))
                        uploadToFirebaseDatabase(data, tableName)
                            .then(() => console.log('Done uploading to database'))
                    })
                    .catch(err => console.log(err))
            })
    })






}

export default airtable2firebase
