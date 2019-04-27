import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux';
import headerReducer from './reducers/headerReducer';
import bodyReducer from './reducers/bodyReducer';
import footerReducer from './reducers/footerReducer';
import invoicesReducer from './reducers/invoicesReducer';
import singleInvoiceReducer from './reducers/singleInvoiceReducer';
import Header from './components/header/header';
import Body from './components/body/body';
import Footer from './components/footer/footer';
import Invoice from './invoices/invoice';
import firebase from './config/firebase';
const db = firebase.firestore();


const reducers = combineReducers({
  invoices: invoicesReducer,
  single: singleInvoiceReducer
});

const store = createStore(reducers);

class App extends Component {

  state = {
    view: false
  }

  handleInovoice = () => {
    this.setState({
      view: true
    })
  }


  render() {

    if (this.state.view) {
      return <Invoice />
    }


    return (
      <div>

        <button onClick={this.handleInovoice}>Stwórz fakturę</button>
        
      </div>
    )
  }
}



document.addEventListener("DOMContentLoaded", function(){

   ReactDOM.render(
     <Provider store = {store}>
       <App />
     </Provider>,
     document.querySelector('#app')
   )
 })
