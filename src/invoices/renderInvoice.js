import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import firebase from '../config/firebase';
import _ from 'lodash';
import logo from './../../img/cl-logo-it.jpg';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
const db = firebase.firestore();
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink
} from 'react-router-dom';
import { Redirect } from 'react-router-dom';

class RenderInvoice extends Component {

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

            //console.log("Data:", data);
            this.props.getInvoices(data);

            let nextNumber = _.sortBy(data, (val) => {
                return Number(val.invoiceNumber.match(/[0-9]+/)[0])
            }).reverse()[0].invoiceNumber.match(/[0-9]+/)[0];

            console.log("NEXT", nextNumber)

            let next = `${Number(nextNumber) + 1}-${new Date().getMonth() + 1}${new Date().getFullYear()}`;

            this.props.editInvoice({
                products: [],
                ...this.props.edited,
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

            //console.log("Data:", data);
            this.props.getInvoices(data);

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
    }

    handleChange = (e) => {
        let invoice = {
            ...this.props.edited,
            [e.currentTarget.name]: e.currentTarget.value
        }

        this.props.editInvoice(invoice)
    }


    handleSubmit = (e) => {
        /////////////// WALIDACJA NABYWCY ////////////
        ///////////////  metoda Redirect z react router do submita żeby wrócić do widoku moje faktury  ////////////
        e.preventDefault();
        let pass = true;
        let error = []

        if (this.props.edited.payment == "disabled") {
            pass = false;
            error.push("Wybierz formę płatności");
            
            
        } else if (this.props.edited.company.length < 8) {
            pass = false;
            error.push("Podaj pełną nazwę nabywcy");
         
            
        } else if (this.props.edited.address.length < 10) {
            pass = false;
            error.push("Podaj pełen adres");
          
            
        } else if (this.props.edited.nip.length !== 10) {
            pass = false;
            error.push("Nieprawidłowy NIP");
            
        }

        this.setState({
            errors: error
        })
        
        
        
        if (pass) {
            db.collection('invoices').doc(this.props.edited.invoiceNumber).set({
                ...this.props.edited
            }).then((res) => {
                this.syncInvoicesFromFirebase()
            }).catch(err => {
                console.log(err)
            })
        }

        ////////////////// REDIRECT //////////////////




    }
      ///////////////////////  KONIEC WALIDACJI NABYWCY /////////////////////
    

    handleChangeProd = (e) => {
        this.setState({ product: { ...this.state.product, [e.currentTarget.name]: e.currentTarget.value } })

        //this.props.editInvoice(invoice) 
    }

    handleSubmitProduct = (e) => {
        e.preventDefault();

    ///////////////////////////// WALIDACJA PRODUKTU //////////////////
        let pass = true;
        let error = [];

        console.log("dddddddddddddd")

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

            console.log("E", this.props.edited)
            let invoice = {
                ...this.props.edited,
                products: [...this.props.edited.products, this.state.product]
            }
        
            this.props.editInvoice(invoice);
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

        if (!this.props.edited) {
            return null;
        }
        
        let errors = this.state.errors.map((e, i) => {
            return <li key={i}>
                {e}
            </li>
        })

        let itemErrors = this.state.newItemErr.map((e, i) => {
            return <li key={i}>
                {e}
            </li>
        });

        let addedItems = [];
        let result = 0;

        if (this.props.edited.products) {
            
            addedItems = this.props.render.products.map((e, i) => {
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
            }) // TRZEBA BĘDZIE ZROBIĆ TO NA STATE JAKO CONTENT EDITABLE
        
            this.props.edited.products.forEach((e, i) => {
                result+= Number((e.amount * e.netto + (e.netto * e.amount * e.vat / 100)).toFixed(2))
            })
        
        }

        //console.log("RESULT : ", result);
        //console.log("ITEMS : ", addedItems);
       
    
        return (
            <div className="edit-invoice-form">
                
    


            <form className="invoice-form" onSubmit={this.handleSubmit}>
            <div>
            <img src={logo} style={{ height: "150px", width: "150px", display: "block" }}></img>
        <div className="invoice-header">
        <div className="left-side-wrapper">      
        <div className="myFirm">
            <h3>Dane Sprzedawcy:</h3><br/>
            <h4>Coders Lab Sp.z o.o.<br/>
                ul. Prosta 51<br/>
                00-838 Warszawa<br/>
                NIP: 5213650730<br/>   
            </h4>
            <br/>
            <h4>
            Nr konta bankowego do przelewów:<br/>
            21 1090 1870 0000 0001 3272 1053
            </h4>
        </div>
        <br/>
        <div className="payementOption">
            <label><h4>Wybierz sposób płatności:</h4></label>
                 <select className="payBy" onChange={this.handleChange} value={this.props.edited.payment} name="payment" style={{ display: 'block' }}>
                    <option value="disabled">Wybierz</option>
                    <option value="cash">Gotówka</option>
                    <option value="card">Karta</option>
                    <option value="wire">Przelew</option>
                </select><br/> 
        </div>
                </div>
        <div className="right-side-wrapper">       
        <div className="invoiceNum"> 
        <h3>Faktura VAT Nr: {this.props.edited.invoiceNumber}/{new Date().getMonth() + 1}/{new Date().getFullYear()}</h3><br/>
            <h3>ORYGINAŁ</h3>
            <h4>Data wystawienia faktury: { (new Date()).toLocaleDateString()}</h4>
            <h4>Termin płatności: {new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString()}</h4>
        </div>
        <br/>                
        <div className="buyerForm">
            <h3>Dane Nabywcy:</h3><br/>
            <label>Nazwa firmy:</label><br/>
            <input onChange={this.handleChange} name="company" value={this.props.edited.company}></input><br/>
            <label>Adres siedziby:</label><br/>
            <textarea onChange={this.handleChange} name="address" value={this.props.edited.address}></textarea><br />
            <label>NIP:</label><br/>
            <input onChange={this.handleChange} name="nip" value={this.props.edited.nip}></input><br />
            <button type="submit">Zatwierdź dane</button><br />
            <ul>{errors}</ul>
        </div>      
        </div>
        </div>        
        <div className="invoice-content">      
            <br />
                <div className="table-wrapper">
                <table className="item-list">
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
                        <tfoot>
                            <tr id="total">
                            <td colSpan="6">RAZEM</td>
                            <td colSpan="2">{result.toFixed(2)} PLN</td>
                        </tr>
                    </tfoot>
                </table>
                </div>
                <br/>    
            </div>
                <br />
                <div className="invoice-bottom">
                <div className="mySign">
                    <hr /><br/>
                    <h4>Imię i Nazwisko osoby upoważnionej<br/> do wystawienia faktury</h4>
                </div>
                <div className="clientSign">
                    <hr /><br/>
                    <h4>Imię i Nazwisko osoby upoważnionej<br/>do odbioru faktury</h4>
                </div>
                </div> 
                <button className="updateInvoice" type="submit">Zaktualizuj fakturę</button>    
            </div>
        </form>
    </div>
    )
  }
    
    componentDidMount() {
        

        let docRef = db.collection("invoices").doc(this.props.match.params.slug);

        console.log(docRef);

        this.getInvoicesFromFirebase();

        docRef.get().then((doc) => {

            if (doc.exists) {  

                if (!doc.data().products) {
                    this.props.editInvoice({ ...doc.data(), products: [] })
                } else {
                    this.props.editInvoice(doc.data())
                }
               

      
             
          
           } else {
      
             // doc.data() will be undefined in this case
      
             console.log("No such document!");
      
           }
      
        }).catch(function(error) {
      
           console.log("Error getting document:", error);
      
         });
    }
}

function mapDispatch(dispatch) {
    return {
        getInvoices: function (data) {
           dispatch({type: "GET_INVOICES", payload: data}) 
        },
        editInvoice: function (data) {
           dispatch({type: "EDIT_INVOICE", payload: data})
        }
    }
}

function mapStateToProps(state) {
    return {
        invoices: state.invoices,
        edited: state.edited
    }
}

export default connect(mapStateToProps, mapDispatch)(EditInvoice)