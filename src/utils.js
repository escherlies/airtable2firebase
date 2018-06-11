import _ from 'lodash'

export const isArtableAttachment = object => {

    const checkProperties = properties => _.indexOf(_.map(properties, property => _.has(object, property)), false) === -1

    return checkProperties(["id", "url", "filename", "size", "type"]) // file
        || checkProperties(["url", "width", "height"]) // thumbnail
}


export const getDateTime = () => {

    const date = new Date()

    let hour = date.getHours()
    hour = (hour < 10 ? "0" : "") + hour

    let min = date.getMinutes()
    min = (min < 10 ? "0" : "") + min

    let sec = date.getSeconds()
    sec = (sec < 10 ? "0" : "") + sec

    let year = date.getFullYear()

    let month = date.getMonth() + 1
    month = (month < 10 ? "0" : "") + month

    let day = date.getDate()
    day = (day < 10 ? "0" : "") + day

    // const dateTime =  year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec
    const dateTimeYMD = year + "-" + month + "-" + day
    return dateTimeYMD
}
