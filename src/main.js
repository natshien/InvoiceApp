import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux';
import headerReducer from './reducers/headerReducer';
import bodyReducer from './reducers/bodyReducer';
import footerReducer from './reducers/footerReducer';
import invoicesReducer from './reducers/invoicesReducer';
import Header from './components/header';
import Body from './components/body';
import Footer from './components/footer';
import firebase from './config/firebase';
const db = firebase.firestore();


const reducers = combineReducers({
  header: headerReducer,
  body: bodyReducer,
  footer: footerReducer,
  invoices: invoicesReducer
});

const store = createStore(reducers);



class App extends React.Component {
   constructor(props) {
   super(props);

   }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.props.invoice);

    const userRef = db.collection('invoices').add({
      invoice: this.props.invoice
    });
  }

   render(){
     console.log("App", this.props.invoices);

    let list = this.props.invoices.map((e,i) => {
      return <li key={i}>{e.invoice.header &&  e.invoice.header.NIP}</li>
    })

     return (
       <>
        <form onSubmit={this.handleSubmit}>
          <Header />
          <Body />
          <Footer />
          <button type="submit">Zapisz</button>
        </form>
        <h1>Lista</h1>
        <ul>
          {list}
        </ul>
      </>

     )
   }

   componentDidMount () {
     db.collection("invoices")
     .get()
     .then((querySnapshot) => {
         let data = [];
         querySnapshot.forEach((doc) => {
             // doc.data() is never undefined for query doc snapshots
             console.log(doc.id, " => ", doc.data());
             data = [...data, doc.data()];

         });
         console.log("Data:", data);
         this.props.getInvoices(data);
     })
     .catch(function(error) {
         console.log("Error getting documents: ", error);
     });
   }
 }

function mapStateToProps(state) {
  return {invoices: state.invoices}
}

 function mapDispatch (dispatch) {
  return {
    getInvoices (invoices) {
      dispatch({ type: 'GET_INVOICES', payload: invoices })
    }
  }
}

const AppData = connect(mapStateToProps, mapDispatch)(App);


document.addEventListener("DOMContentLoaded", function(){

   ReactDOM.render(
     <Provider store = {store}>
       <AppData />
     </Provider>,
     document.querySelector('#app')
   )
 })
