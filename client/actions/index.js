export const setClientWindow = () => {
  return {
    type: 'SET_CLIENT_WINDOW',
    payload: null
  }
}

export const getUserToken = () => {
  return {
    type: 'GET_USER_TOKEN',
    payload: null
  }
};

export const updateUserToken = (payload) => {
  return {
    type: 'UPDATE_USER_TOKEN',
    payload
  }
};

export const removeUserToken = () => {
  return {
    type: 'REMOVE_USER_TOKEN',
    payload: null
  }
};

export const setErrorText = (payload) => {
  return {
    type: 'SET_ERROR_TEXT',
    payload
  }
};

export const clearErrorText = () => {
  return {
    type: 'CLEAR_ERROR_TEXT',
    payload: false
  }
};

export const updateComponentTitle = (payload) => {
  return {
    type: 'UPDATE_COMPONENT_TITLE',
    payload
  }
};
