import { v4 as uuid_v4 } from 'uuid'
import { version } from '../../package.json'

const uuid = uuid_v4()

export {
    uuid,
    version
}