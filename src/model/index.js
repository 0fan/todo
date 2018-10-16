import { combineReducers } from 'redux'

import { reducer as user } from './user'
import { reducer as team } from './team'

export default combineReducers({
  user,
  team
})
