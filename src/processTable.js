import { airtableBase } from './bases'
import uploadAndAttatchUrls from './uploadAndAttatchUrls'
import uploadToFirebaseDatabase from './uploadToFirebaseDatabase'


const processTable = tableName => {
    return new Promise((resolve, reject) => {
        console.log(`Processing table: ${tableName}`)

        let table = []

        airtableBase(tableName)
            .select()
            .eachPage(function page(records, fetchNextPage) {

                table = [...table, ...records.map(record => record._rawJson)]
                fetchNextPage()

            }, function done(err) {

                if (err) reject(err)

                uploadAndAttatchUrls(table, tableName)
                    .then(data => uploadToFirebaseDatabase(data, tableName))
                    .then(() => { console.log(`Table ${tableName}: Done setting to database`); resolve() })
                    .catch(err => reject(err))
            })
    })
}

export default processTable
