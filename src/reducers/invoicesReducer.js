export default function invoices(state = [], action) {
  console.log(state);
  switch(action.type) {
    case 'GET_INVOICES':
    return [...action.payload];
    break;
  }
  return state;
}
