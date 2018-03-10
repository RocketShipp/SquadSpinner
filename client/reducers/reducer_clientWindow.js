import $ from 'jquery';

export default function(state = { height: $(window).height(), width: $(window).width() }, action) {
 if (action.type === 'SET_CLIENT_WINDOW') {
   return {
      height: $(window).height(),
      width: $(window).width()
    }
  } else {
    return state;
  }
}
