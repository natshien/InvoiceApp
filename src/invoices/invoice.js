import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../config/firebase';
import _ from 'lodash';
const db = firebase.firestore();



class Invoice extends Component {

    state = {product: {}, errors: []}

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

        //if (e.currentTarget.value.length < 2) {
            
        //}
        

        this.props.singleInvoice(invoice)
    }


    handleSubmit = () => {
        /////////////// WZOR DO WALIDACJI WSZYSTKICH INPUTOW ////////////
        let pass = true;
        let errors = []

        if (this.props.single.vat.length < 10) { 
            pass = false;
            error.push("błąd")


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

      ///////////////////////  KONIEC WZORU /////////////////////
    }

    handleChangeProd = (e) => {
        this.setState({ product: { ...this.state.product, [e.currentTarget.name]: e.currentTarget.value } })

        //this.props.singleInvoice(invoice) 
    }

    handleSubmitProduct = () => {

        let invoice = {
            ...this.props.single,
            products: [...this.props.single.products, this.state.product]
        }
        
        this.props.singleInvoice(invoice);
        this.setState({
            product: {}
        })
    }

   

    render() {
    
    let logo = "./../img/logo-pl.png";
    
    return (
        <form onSubmit={this.handleSubmit}>
        <div>
    <div className="invoiceNum"> 
    <h3>Faktura VAT Nr: {this.props.single.invoiceNumber}/{new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
        <h3>ORYGINAŁ</h3>
        <h4>Data wystawienia faktury: { (new Date()).toLocaleDateString()}</h4>
        <h4>Termin płatności:{new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString()}</h4>
    </div>
    <div className="myFirm">
            <img src={logo} style={{ height: "100px", width: "150px", display: "block" }}></img>
            <br /> <br />
            <h3>Dane Sprzedawcy:</h3>
            <h4>Coders Lab Sp.z o.o.<br/>
                ul. Prosta 51<br/>
                00-838 Warszawa<br/>
                NIP: 5213650730<br/>   
            </h4>
            <h5>
            Nr konta bankowego do przelewów:<br/>
            21 1090 1870 0000 0001 3272 1053
            </h5>
        </div>
        <div className="payementOption">
            <h4>Sposób płatności:</h4>
                    <select onChange={this.handleChange} value={this.props.single.payment} name="payment" style={{ display: 'block' }}>
                    <option name="disabled">Wybierz</option>
                    <option name="cash">Gotówka</option>
                    <option name="card">Karta</option>
                    <option name="wire">Przelew</option>
                </select><br/>
                    <label>Forma płatności: {this.props.single.payment}</label><br/>
                    <button type="submit">Wybierz</button>     
        </div>       
        <div className="buyerForm">
            <h4>Dane Nabywcy:</h4>
            <label>Nazwa firmy:</label><br/>
            <input onChange={this.handleChange} name="company" value={this.props.single.company}></input><br/>
            <label>Adres siedziby:</label><br/>
            <textarea onChange={this.handleChange} name="address" value={this.props.single.address}></textarea><br />
            <label>NIP:</label><br/>
            <input onChange={this.handleChange} name="nip" value={this.props.single.nip}></input><br/><br/>
            <button type="submit">Zatwierdź dane</button>
        </div>
        <br/>
        <div className="itemList">
            <label>Towar / Usługa:</label><br/>
            <input onChange={this.handleChangeProd} name="item" value={this.props.single.item}></input><br/>
            <label>Ilość:</label><br/>
            <input onChange={this.handleChangeProd} type="number" name="amount" value={this.props.single.amount}></input><br/>
            <label>Cena netto:</label><br/>
            <input onChange={this.handleChangeProd} type="number" name="netto" value={this.props.single.netto}></input><br />
            <label>VAT:</label><br />
                <select onChange={this.handleChangeProd} name="vat" style={{display: 'block'}} value={this.props.single.vat}>
                    <option name="5">5 %</option>
                    <option name="8">8 %</option>
                    <option name="23">23 %</option>
                </select><br/>
         
                </div>    
                <button onClick={this.handleSubmitProduct}>Dodaj produkt</button>
                <br/>
                <button type="submit">Wystaw fakturę</button>
            
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