let defaultState = {
  products: []
}

export default function invoices(state = defaultState, action) {

    switch(action.type) {
      case 'SET_SINGLE':
      return action.payload;
      break;
    }
    return state;
  }
  