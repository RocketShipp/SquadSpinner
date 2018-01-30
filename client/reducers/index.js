import { combineReducers } from 'redux';
import PlaylistReducer from './reducer_playlist';

const rootReducer = combineReducers({
  playlist: PlaylistReducer
})

export default rootReducer;
