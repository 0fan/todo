import { combineReducers } from 'redux'

import { reducer as user } from './user'
import { reducer as task } from './task'
import { reducer as team } from './team/reducer'
import { reducer as dict_team } from './dict_team'

export default combineReducers({
  user,
  team,
  task,
  dict_team,
})
