export default function(state = 'SquadSpinner', action) {
  switch(action.type) {
    case 'UPDATE_COMPONENT_TITLE':
      return action.payload;
      break;
  }
  return state;
}
