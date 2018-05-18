import { firebaseDatabase } from './bases'
import _ from 'lodash'


const uploadToFirebaseDatabase = (data, ref) => {

    const firebaseData = {}

    _.forEach(data, item => firebaseData[item.id] = item)

    console.log(`Table ${ref}: ${_.size(firebaseData)} items`)

    return firebaseDatabase.ref(ref).set(firebaseData)
}

export default uploadToFirebaseDatabase
