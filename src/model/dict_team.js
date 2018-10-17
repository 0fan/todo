import _ from 'lodash'

import ajax from '../util/ajax'
import { url, api } from '../config/api'

const initState = {
  data: [],

  /* 状态 */
  loading: false,
  init: false,
  msg: ''
}

const loading = 'dict_team/loading'
const loaded = 'dict_team/loaded'
const fail = 'dict_team/fail'
const success = 'dict_team/success'

export function getTeamDict (payload = {}) {
  return async (dispatch, getState) => {
    const {
      dict_team: {
        loading: _loading
      }
    } = getState()

    if (_loading) {
      return ['重复请求']
    }

    dispatch({ type: loading })

    const [err, res] = await ajax(url.server + api.dict.team, payload)

    dispatch({ type: loaded })

    if (err) {
      dispatch({ payload: err, type: fail })

      return [err]
    }

    dispatch({
      payload: {
        data: _.isArray(res) ? res : []
      },
      type: success
    })

    return [null, res]
  }
}

/* reducer */
export const reducer = (state = initState, action) => {
  const {
    type,
    payload = {}
  } = action

  switch (type) {
    case loading:
      return {
        ...state,

        msg: '',
        loading: true,
      }
    case loaded:
      return {
        ...state,

        loading: false
      }
    case fail:
      return {
        ...state,

        fail: payload,
      }
    case success:
      return {
        ...state,
        ...payload,

        init: true,
      }

    default:
      return state
  }
}
/* end reducer */
