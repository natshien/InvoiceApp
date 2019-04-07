import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

class Footer extends React.Component {
   constructor(props) {
   super(props);

   }

  handleChange = (e) => {
    console.log(e.currentTarget.checked);
    this.props.setDiscount(e.currentTarget.checked)
  }

   render(){
     console.log(this.props);
     return (

      <>
      <h1>{this.props.footer.discount}</h1>
        <input value={this.props.footer.discount} name={"discount"} onChange={this.handleChange} type={"checkbox"}></input>
      </>

     )
   }
 }

 function mapStateToProps(state) {
   return {
     footer: state.footer
   }
 }

 function mapDispatch (dispatch) {
  return {
    setDiscount (discount) {
      console.log(discount);
      dispatch({ type: 'SET_DISCOUNT', payload: discount })
    }
  }
}


 export default connect(mapStateToProps, mapDispatch)(Footer)
