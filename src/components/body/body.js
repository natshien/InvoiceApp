import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import AddItemsForm from './addItemsForm';


class Body extends React.Component {
  state = { 

  }
  render() { 
    return <div className="body-wrapper">
    <h1>BODY</h1>
    <AddItemsForm />
    </div>
  }
}
 
export default Body;