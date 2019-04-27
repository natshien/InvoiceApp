import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

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
      <label htmlFor="">
        Firma:
        <input value={this.props.header.company} name={"company"} onChange={this.handleChange} type={"text"}></input>
      </label>
      <label htmlFor="">
        NIP:
        <input value={this.props.header.NIP} name={"NIP"} onChange={this.handleChange} type={"text"}></input>
      </label>

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
