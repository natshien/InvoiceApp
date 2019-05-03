import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import firebase from '../config/firebase';
import _ from 'lodash';
import logo from './../../img/cl-logo-it.jpg';
const db = firebase.firestore();
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink
} from 'react-router-dom';

class Invoice extends Component {

    state = {
        product: {
            item: "",
            amount: "",
            netto: "",
            vat: "wrong"
        },
        errors: [],
        newItemErr: []
    }

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

            let nextNumber = _.sortBy(data, (val) => {
                console.log(val.invoiceNumber, val.invoiceNumber.match(/[0-9]+/)[0])
                return Number(val.invoiceNumber.match(/[0-9]+/)[0])
            }).reverse()[0].invoiceNumber.match(/[0-9]+/)[0];

            console.log("NEXT", nextNumber)

            let next = `${Number(nextNumber) + 1}-${new Date().getMonth() + 1}${new Date().getFullYear()}`;

            console.log(next)

            this.props.singleInvoice({
                products: [],
                ...this.props.single,
                invoiceNumber: next
            })

            db.collection('invoices').doc(next).set({
                invoiceNumber: next
            }).then((res) => {
                this.syncInvoicesFromFirebase()
            }).catch(err => {
                console.log(err)
            })

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
    }

    syncInvoicesFromFirebase = () => {
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

    handleChange = (e) => {
        let invoice = {
            ...this.props.single,
            [e.currentTarget.name]: e.currentTarget.value
        }

        this.props.singleInvoice(invoice)
    }


    handleSubmit = (e) => {
        /////////////// WALIDACJA NABYWCY ////////////
        e.preventDefault();
        let pass = true;
        let error = []

        if (this.props.single.payment == "disabled") { 
            pass = false;
            error.push("Wybierz formę płatności");
            
            
        } else if (this.props.single.company.length < 8) {
            pass = false;
            error.push("Podaj pełną nazwę nabywcy");
         
            
        } else if (this.props.single.address.length < 10) {
            pass = false;
            error.push("Podaj pełen adres");
          
            
        } else if (this.props.single.nip.length !== 10) {
            pass = false;
            error.push("Nieprawidłowy NIP");  
            
        }

        this.setState({
            errors: error
        })
        
        
        
        if (pass) {
            db.collection('invoices').doc(this.props.single.invoiceNumber).set({
                ...this.props.single
            }).then((res) => {
                this.syncInvoicesFromFirebase()
            }).catch(err => {
                console.log(err)
            })
        }

      ///////////////////////  KONIEC WALIDACJI NABYWCY /////////////////////
    }

    handleChangeProd = (e) => {
        this.setState({ product: { ...this.state.product, [e.currentTarget.name]: e.currentTarget.value } })

        //this.props.singleInvoice(invoice) 
    }

    handleSubmitProduct = (e) => {
        e.preventDefault();

    ///////////////////////////// WALIDACJA PRODUKTU //////////////////
        let pass = true;
        let error = []

        if (this.state.product.item.length < 3) {
            pass = false;
            error.push("Wprowadź nazwę produktu");
        } else if (this.state.product.amount.length > 2) {
            pass = false;
            error.push("Podaj ilość");
        } else if (this.state.product.netto.length < 2) {
            pass = false;
            error.push("Podaj cenę netto");
        } else if (this.state.product.vat == "wrong") {
            pass = false;
            error.push("Wybierz wartość VAT");
        }

        this.setState({
            newItemErr: error
        })
        
        
        if (pass) {

            let invoice = {
                ...this.props.single,
                products: [...this.props.single.products, this.state.product]
            }
        
            this.props.singleInvoice(invoice);
            this.setState({
                product: {
                    item: "",
                    amount: "",
                    netto: "",
                    vat: "wrong"
                }
            })
        }    
       //////////////////////////////// KONIEC WALIDACJI PRODUKTU ////////////////////////////////     
    }


    render() {
       
    
        //let logo = "./../../img/logo-pl.png";  lepiej działa przez import
        
        let errors = this.state.errors.map((e, i) => {
            return <li key={i}>
                {e}
            </li>
        })

        let itemErrors = this.state.newItemErr.map((e, i) => {
            return <li key={i}>
                {e}
            </li>
        })

        let addedItems = this.props.single.products.map((e, i) => {
            return <tr key={i}>
                <td>{e.item}</td>
                <td>{e.amount}</td>
                <td>szt</td>
                <td>{e.netto}</td>
                <td>{e.vat} %</td>
                <td>{(e.netto * e.amount * e.vat / 100).toFixed(2)}</td>
                <td>{(e.netto * e.amount).toFixed(2)}</td>
                <td>{(e.amount * e.netto + (e.netto * e.amount * e.vat / 100)).toFixed(2)}</td>
            </tr>
        })
    
    return (
        <form className="invoice-form" onSubmit={this.handleSubmit}>
            <div>
            <img src={logo} style={{ height: "150px", width: "150px", display: "block" }}></img>
        <div className="invoice-header">
        <div className="left-side-wrapper">      
        <div className="myFirm">
            <h3>Dane Sprzedawcy:</h3>
            <h4>Coders Lab Sp.z o.o.<br/>
                ul. Prosta 51<br/>
                00-838 Warszawa<br/>
                NIP: 5213650730<br/>   
            </h4>
            <br/>
            <h5>
            Nr konta bankowego do przelewów:<br/>
            21 1090 1870 0000 0001 3272 1053
            </h5>
        </div>
        <br/>
        <div className="payementOption">
            <h4>Wybierz sposób płatności:</h4>
                    <select onChange={this.handleChange} value={this.props.single.payment} name="payment" style={{ display: 'block' }}>
                    <option  value="disabled">Wybierz</option>
                    <option value="cash">Gotówka</option>
                    <option value="card">Karta</option>
                    <option value="wire">Przelew</option>
                </select><br/> 
        </div>
                </div>
        <div className="right-side-wrapper">       
        <div className="invoiceNum"> 
        <h3>Faktura VAT Nr: {this.props.single.invoiceNumber}/{new Date().getMonth() + 1}/{new Date().getFullYear()}</h3><br/>
            <h3>ORYGINAŁ</h3>
            <h4>Data wystawienia faktury: { (new Date()).toLocaleDateString()}</h4>
            <h4>Termin płatności: {new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString()}</h4>
        </div>
        <br/>                
        <div className="buyerForm">
            <h4>Dane Nabywcy:</h4>
            <label>Nazwa firmy:</label><br/>
            <input onChange={this.handleChange} name="company" value={this.props.single.company}></input><br/>
            <label>Adres siedziby:</label><br/>
            <textarea onChange={this.handleChange} name="address" value={this.props.single.address}></textarea><br />
            <label>NIP:</label><br/>
            <input onChange={this.handleChange} name="nip" value={this.props.single.nip}></input><br/><br/>
            <button type="submit">Zatwierdź dane</button>
            <ul>{errors}</ul>
        </div>      
        </div>
        </div>        
        <div className="invoice-content">      
        <div className="addItem">
            <label>Towar / Usługa:</label><br/>
            <input onChange={this.handleChangeProd} name="item" value={this.state.product.item}></input><br/>
            <label>Ilość:</label><br/>
            <input onChange={this.handleChangeProd} type="number" name="amount" value={this.state.product.amount}></input><br/>
            <label>Cena netto:</label><br/>
            <input onChange={this.handleChangeProd} type="number" name="netto" value={this.state.product.netto}></input><br/>
            <label>VAT:</label><br />
                <select onChange={this.handleChangeProd} name="vat" style={{display: 'block'}} value={this.state.product.vat}>
                    <option value="wrong">Wybierz</option>
                    <option value="5">5 %</option>
                    <option value="8">8 %</option>
                    <option value="23">23 %</option>
                    </select><br />
                    <ul>{itemErrors}</ul>
                    <br />
                </div> 
                <button onClick={this.handleSubmitProduct}>Dodaj produkt</button>
                <br />
                <div className="table-wrapper">
                <table className="item-list" style={{border: "black solid 1px"}}>
                    <thead>
                        <tr style={{border: "black solid 1px"}}>
                            <th> Towar / Usługa </th>
                            <th> Ilość </th>
                            <th> j.m. </th>
                            <th> Cena netto </th>
                            <th> Stawka VAT </th>
                            <th> Kwota VAT </th>
                            <th> Kwota netto </th>
                            <th> Kwota brutto </th>
                        </tr>
                    </thead>
                    <tbody>
                        {addedItems}
                    </tbody>
                </table>
                </div>
                <br/>
                <button type="submit">Wystaw fakturę</button>
                </div>
                <br />
                <div className="invoice-bottom">
                <div className="mySign">
                    <hr /><br/>
                    <h4>Imię i Nazwisko osoby upowaznionej<br/> do wystawienia faktury</h4>
                </div>
                <div className="clientSign">
                    <hr /><br/>
                    <h4>Imię i Nazwisko osoby upowaznionej<br/>do odbioru faktury</h4>
                </div>
            </div>    
            </div>
            
        </form>
    )
  }
    
    componentDidMount() {
       this.getInvoicesFromFirebase()
    }
}

function mapDispatch(dispatch) {
    return {
        getInvoices: function (data) {
           dispatch({type: "GET_INVOICES", payload: data}) 
        },
        singleInvoice: function (data) {
            dispatch({type: "SET_SINGLE", payload: data}) 
        }
    }
}

function mapStateToProps(state) {
    return {
        invoices: state.invoices,
        single: state.single
    }
}

export default connect(mapStateToProps, mapDispatch)(Invoice)