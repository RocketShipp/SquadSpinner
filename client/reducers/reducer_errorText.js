export default function(state = null, action) {
  switch(action.type) {
    case 'SET_ERROR_TEXT':
      return action.payload;
      break;
    case 'CLEAR_ERROR_TEXT':
      return null;
      break;
  }
  return state;
}
