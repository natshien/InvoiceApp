
export default function invoices(state = false, action) {
  
      switch(action.type) {
        case 'EDIT_INVOICE':
        return action.payload;
        break;
      }
      return state;
    }
