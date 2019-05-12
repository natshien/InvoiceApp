import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import firebase from '../config/firebase';
import MyInvoices from './myInvoices';
import Invoice from './invoice';
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink
} from 'react-router-dom';

class Menu extends Component {
    render() { 
        return <div className="main-menu">
            <h1>Invoice App</h1>
            <hr/>
            <br />
            <br/>
            <h2><Link to="/my_invoices">Moje faktury</Link></h2> 
            <br/>
            <h2><Link to="/new_invoice">Wystaw nową fakturę</Link></h2>
        </div>
    
    }
}
 
export default Menu;