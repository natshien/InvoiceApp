import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

class MyFirm extends React.Component {
    state = {
        payBy: "",
        feedback: ""
    }

    selectOption = (e) => {
        this.setState({
            payBy: e.currentTarget.value
        })
    }

    submitPayment = (e) => {
        e.preventDefault;
        if (this.state.payBy === "") {
            this.setState({
                feedback: "Wybierz sposób płatności z listy"
            })
        }
    }

    render() { 
        return <div className="myFirm">
        <img src="../img/logo-pl.png" style={{ height: "100px", width: "150px", display: "block" }}></img>
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
            <div className="form-wrapper">
            <form onSubmit={this.submitPayment} className="selectPayment">
                <h4>Sposób płatności:</h4>
                <select onChange={this.selectOption}style={{display: 'block'}}><br/>
                    <option name="cash">Gotówka</option>
                    <option name="card">Karta</option>
                    <option name="wire">Przelew</option>
                </select><br/>
                    <label>Rodzaj płatności: {this.state.payBy}</label>
                    <span style={{ color: "red" }}>{this.state.feedback}</span><br/>
                    <button type="submit">Wybierz</button>
                </form>
                </div>
            </div>
    }
}
 
export default MyFirm;

//export default connect(mapStateToProps)(myFirm);