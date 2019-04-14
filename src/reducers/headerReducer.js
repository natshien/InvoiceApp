let dane = {
  NIP: '',
  company: '',
}


export default function header(state = dane, action) {

  console.log(action.payload);

  switch(action.type) {
    case 'ADD_SENDER':
    return {...state, ...action.payload};
    break;
  }
  return state;
}
