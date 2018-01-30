import { FETCH_PLAYLIST } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case FETCH_PLAYLIST:
      return [ action.payload.data, ...state ];
    default:
      return state;
  }
}
