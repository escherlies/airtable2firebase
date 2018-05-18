import { firebaseDatabase } from './bases'
import _ from 'lodash'


const uploadToFirebaseDatabase = (data, ref) => {

    const firebaseData = {}

    _.forEach(data, item => firebaseData[item.id] = item)

    return firebaseDatabase.ref(ref).set(firebaseData)
}

export default uploadToFirebaseDatabase
