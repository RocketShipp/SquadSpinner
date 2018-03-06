export const getUserToken = (payload) => {
  return {
    type: 'GET_USER_TOKEN',
    payload
  }
};

export const updateUserToken = (newToken) => {
  return {
    type: 'UPDATE_USER_TOKEN',
    payload: newToken
  }
};

export const removeUserToken = () => {
  return {
    type: 'REMOVE_USER_TOKEN',
    payload: null
  }
};

export const setErrorText = (text) => {
  return {
    type: 'SET_ERROR_TEXT',
    payload: text
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
