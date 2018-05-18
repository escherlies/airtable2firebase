# Airtable to Firebase Service

Get Airtable data and files and put them on firebase databse and storage.

- Airtable: https://airtable.com/
- Firebase: https://firebase.google.com/

## Motivation

- Using airtable as a nicely maintainble spreadsheet. Airtable also has a nice API which can give you the data in rawJSON format. However, airtable is no production API!
- Using firebase a backend production because it's easy to setup, fast and uses JSON for database.
- Use this tool to receive data from airtable, upload all files to firebase storage and push the data to firebase database.

## Before you start...

...make sure to
- have an airtable base with tables
- have a firebase project set up and downloaded service account credentials

## How to Use

1. Clone and install this repo (`npm install`)
2. Set up `settings.json` with your information
3. `npm run start` starts the script
