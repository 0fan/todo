const initState = {
  id: ''
}

/* reducer */
export const reducer = (state = initState, action) => {
  const {
    type,
    payload = {}
  } = action

  switch (type) {
    default:
      return state
  }
}
