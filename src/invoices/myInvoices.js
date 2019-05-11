import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import firebase from '../config/firebase';
const db = firebase.firestore();
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink
} from 'react-router-dom';
//<li key={i}><Link to="/my_invoices/${e.invoiceNumber}">{e.invoiceNumber}</Link></li> 

class MyInvoices extends Component {
    
    getInvoicesFromFirebase = () => {
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
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });
    }

    render() {
        
        let allInvoices = this.props.invoices.map((e,i) => {
            return <li key={i}>
                <h2>{e.invoiceNumber}</h2>
                <button><Link to={`/my_invoices/${e.invoiceNumber}`}>Edytuj fakturę</Link></button><br/>
                <button id="pdf">Generuj PDF</button><br/>
            </li>        
        })
        
        return <ul>
            {allInvoices}
        </ul>
    }
    
    componentDidMount() {
        this.getInvoicesFromFirebase()
    }
    
}
 
function mapDispatch(dispatch) {
    return {
        getInvoices: function (data) {
           dispatch({type: "GET_INVOICES", payload: data}) 
        }
    }
}

function mapStateToProps(state) {
    return {
        invoices: state.invoices,
    }
}

export default connect(mapStateToProps, mapDispatch)(MyInvoices)