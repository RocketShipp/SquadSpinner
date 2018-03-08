export default function(state = localStorage.getItem('authorization') || null, action) {
  switch(action.type) {
    case 'GET_USER_TOKEN':
      return state;
      break;
    case 'UPDATE_USER_TOKEN':
      localStorage.setItem('authorization', action.payload)
      return action.payload;
      break;
    case 'REMOVE_USER_TOKEN':
      localStorage.removeItem('authorization');
      return state;
      break;
  }
  return state;
}
