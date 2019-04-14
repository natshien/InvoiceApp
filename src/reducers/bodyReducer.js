export default function body(state = {price: 12}, action) {
  switch(action.type) {
    case 'ADD_PRICE':
    return {price: action.payload};
    break;
  }
  return state;
}
