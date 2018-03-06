export default function(state = null, action) {
  switch(action.type) {
    case 'GET_USER_TOKEN':
      return action.payload;
      break;
    case 'UPDATE_USER_TOKEN':
      return action.payload;
      break;
    case 'REMOVE_USER_TOKEN':
      localStorage.removeItem('token');
      return state;
      break;
  }
  return state;
}
