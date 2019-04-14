export default function body(state = {discount: true}, action) {
  console.log(state);
  switch(action.type) {
    case 'SET_DISCOUNT':
    return {discount: action.payload};
    break;
  }
  return state;
}
