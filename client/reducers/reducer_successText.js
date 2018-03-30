export default function(state = null, action) {
  switch(action.type) {
    case 'SET_SUCCESS_TEXT':
      return action.payload;
      break;
    case 'CLEAR_SUCCESS_TEXT':
      return null;
      break;
  }
  return state;
}
