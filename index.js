import airtable2firebase from './src/airtable2firebase.js'
import settings from './settings.json'

airtable2firebase(...settings.airtable.tables)
