import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import MyFirm from './myFirm';
import InvoiceForm from './invoiceForm';

class Header extends React.Component {
   constructor(props) {
   super(props);

   }

  handleChange = (e) => {
    this.props.setProduct({[e.currentTarget.name]: e.currentTarget.value})
  }

   render(){
     console.log(this.props);
     return (
      <>
      <MyFirm />
      <br/>
      <InvoiceForm />
      </>
     )
   }
 }

 function mapStateToProps(state) {
   return {
     header: state.header
   }
 }

 function mapDispatch (dispatch) {
  return {
    setProduct (prod) {
      dispatch({ type: 'ADD_SENDER', payload: prod })
    }
  }
}

 export default connect(mapStateToProps, mapDispatch)(Header)
