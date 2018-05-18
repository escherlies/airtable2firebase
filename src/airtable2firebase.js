import _ from 'lodash'
import processTable from './processTable'

const logGreen = text => console.log('\x1b[32m' + text + '\x1b[0m');

const airtable2firebase = (...args) => {
    console.log('\x1b[36m%s\x1b[0m', '\n*** Airtable to Firebase ***\n');  //yellow

    const tableProcessingPromisses = _.map(args, tableName => processTable(tableName))

    Promise
        .all(tableProcessingPromisses)
        .then(() => { logGreen('All Done'); process.exit() })
        .catch(error => { console.error(error); process.exit() })
}

export default airtable2firebase
