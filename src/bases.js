import Airtable from 'airtable'
import firebaseAdmin from 'firebase-admin'

// configs
import settings from '../settings.json'


// init
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: settings.airtable.apiKey
})
const airtableBase = Airtable.base(settings.airtable.base.id)

// init firebase admin
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(settings.firebase.serviceAccount),
    databaseURL: settings.firebase.databaseURL
})

const firebaseBucket = firebaseAdmin.storage().bucket(settings.firebase.bucket);
const firebaseDatabase = firebaseAdmin.database()



export { airtableBase, firebaseBucket, firebaseDatabase }
