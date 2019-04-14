import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';


class InvoiceNumber extends React.Component {
    state = {
        date: new Date(),
        duedate: new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString(),
        id: ""
    }

    render() {
     //Numer i format faktury w h3: /*{this.state.id} /this.state.date.toLocaleMonthString()+1/this.state.date.toLocaleYearString() */

        return (<div className="invoiceNum"> 
            <h3>Faktura VAT Nr: </h3>
            <h3>ORYGINAŁ</h3>
            <h4>Data wystawienia faktury: {this.state.date.toLocaleDateString()}</h4>
            <h4>Termin płatności:{this.state.duedate} </h4>
        </div>);
    }
}

 
class BuyerData extends React.Component {
    state = {
        company: "",
        address: "",
        nip: ""
    }

    changeCompany = (e) => {
        this.setState({
            company: e.target.value
        })
    }

    changeAddress = (e) => {
        this.setState({
            address: e.target.value
        })
    }

    changeNIP = (e) => {
        this.setState({
            nip: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault;
    }
    
    render() { 
        return (<div className="buyerForm">
            <h4>Dane Nabywcy</h4>
            <form onSubmit={this.handleSubmit}>
            <label>Nazwa firmy:</label><br/>
            <input onChange={this.changeCompany} name="company" value={this.state.company}></input><br/>
            <label>Adres siedziby:</label><br/>
            <textarea onChange={this.changeAddress} name="address" value={this.state.address}></textarea><br />
            <label>NIP:</label><br/>
            <input onChange={this.changeNIP} name="nip" value={this.state.nip}></input><br/><br/>
            <button type="submit">Zatwierdź dane</button>
            </form>
        </div>)
    }
}


class InvoiceForm extends React.Component {
    
    render() { 
        return <>
            <InvoiceNumber />
            <br/>
            <BuyerData />
            </>
    }
}
 
export default InvoiceForm;