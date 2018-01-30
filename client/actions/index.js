import axios from 'axios';

export const FETCH_PLAYLIST = 'FETCH_PLAYLIST';
export const CREATE_USER = 'CREATE_USER';

export function fetchPlaylist(lobbyId) {
  const url = '';
  const request = axios.get(url);
  return {
    type: FETCH_PLAYLIST,
    payload: request
  }
}

export function createUser(user) {
  const url = '';
  const request = axios.get(url);
  return {
    type: CREATE_USER,
    payload: request
  }
}
