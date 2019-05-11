import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux';
import invoicesReducer from './reducers/invoicesReducer';
import singleInvoiceReducer from './reducers/singleInvoiceReducer';
import editInvoiceReducer from './reducers/editInvoiceReducer';
import Invoice from './invoices/invoice';
import MyInvoices from './invoices/myInvoices';
import EditInvoice from './invoices/editInvoice';
import Menu from './invoices/mainMenu';
import firebase from './config/firebase';
const db = firebase.firestore();
import {
  BrowserRouter,
  Route,
  Link,
  Switch,
  NavLink
} from 'react-router-dom';
require("./../style/style.css");

const reducers = combineReducers({
  invoices: invoicesReducer,
  single: singleInvoiceReducer,
  edited: editInvoiceReducer
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

    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Menu}></Route>
            <Route exact path="/new_invoice" component={Invoice}></Route>
            <Route exact path="/my_invoices" component={MyInvoices}></Route>
            <Route exact path="/my_invoices/:slug" component={EditInvoice}></Route>
          </Switch>
        </BrowserRouter>        
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
