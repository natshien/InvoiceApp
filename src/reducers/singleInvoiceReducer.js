export default function invoices(state = {products: []}, action) {

    switch(action.type) {
      case 'SET_SINGLE':
      return action.payload;
      break;
    }
    return state;
  }
  