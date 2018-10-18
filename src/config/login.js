import store from '../util/store'
import ajax, { setToken } from '../util/ajax'

import { loginSuccess } from '../model/user'
import { getTeamDict } from '../model/dict_team'
import { getTeam } from '../model/team/method'

export default async function login (Store) {
  const user = store.get('user')
  const token = store.get('token')

  if (
    !user ||
    !token ||
    !user.id
  ) {
    return false
  }

  setToken(token)

  await Store.dispatch(loginSuccess(user))
  await Store.dispatch(getTeamDict())
  await Store.dispatch(getTeam({ userId: user.id }))

  return true
}
