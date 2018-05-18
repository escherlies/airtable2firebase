import _ from 'lodash'


export const isArtableAttachment = object => {

    const checkProperties = properties => _.indexOf(_.map(properties, property => _.has(object, property)), false) === -1

    return checkProperties(["id", "url", "filename", "size", "type"]) // file
        || checkProperties(["url", "width", "height"]) // thumbnail
}
