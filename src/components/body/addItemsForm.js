import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

class AddItemsForm extends React.Component {
    state = { 
        item: "",
        amount: "",
        netto: "",
        vat: "",
        products: []
    }

    changeItem = (e) => {
        this.setState({
            item: e.target.value
        })
    }

    changeAmount = (e) => {
        this.setState({
            amount: e.target.value
        })
    }

    changeNetPrice= (e) => {
        this.setState({
            netto: e.target.value
        })
    }

    changeVAT = (e) => {
        this.setState({
            vat: e.target.value
        })
    }

    AddItem = (e) => {
        e.preventDefault();
    }

    render() { 
        return <div className="itemList">
        <form onSubmit={this.AddItem}>
        <label>Towar / Usługa:</label><br/>
        <input onChange={this.changeItem} name="item" value={this.state.company}></input><br/>
        <label>Ilość:</label><br/>
        <input onChange={this.changeAmount} type="number" name="amount" value={this.state.company}></input><br/>
        <label>Cena netto:</label><br/>
        <input onChange={this.changeNetPrice} type="number" name="netto" value={this.state.address}></input><br />
        <label>VAT:</label><br />
            <select onChange={this.changeVAT} name="vat" style={{display: 'block'}}><br/>
                <option name="5">5 %</option>
                <option name="8">8 %</option>
                <option name="23">23 %</option>
            </select><br/>
        <button type="submit">Dodaj</button>
        </form>
    </div>
    }
}
 
export default AddItemsForm;