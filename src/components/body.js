import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

class Body extends React.Component {
   constructor(props) {
   super(props);

   }

  handleChange = (e) => {
    this.props.setPrice(e.currentTarget.value)
  }

   render(){
     return (
      <>
      <h1>{this.props.body.price}</h1>
        <input value={this.props.body.price} name={"price"} onChange={this.handleChange} type={"text"}></input>
      </>

     )
   }
 }

 function mapStateToProps(state) {
   return {
     body: state.body
   }
 }

 function mapDispatch (dispatch) {
  return {
    setPrice (price) {
      dispatch({ type: 'ADD_PRICE', payload: price })
    }
  }
}


 export default connect(mapStateToProps, mapDispatch)(Body)
