const initialState = {
  offset: 0
}
export default (state = initialState, action) => {
  switch (action.type) {
  case 'READ_FILE':
    return {
      ...state,
      file: action.file
    }
  case 'SET_OFFSET':
    return {
      ...state,
      offset: action.offset
    }
  default:
    return state
  }
}
