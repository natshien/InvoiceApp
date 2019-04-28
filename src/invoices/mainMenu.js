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
        return <div>
            <h2>Invoice App Menu</h2>
            <Link to="/my_invoices">Moje faktury</Link>
            <br/>
            <Link to="/new_invoice">Wystaw nową fakturę</Link>
        </div>
    
    }
}
 
export default Menu;