import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

class MySignature extends React.Component {
  render() { 
    return <div className="mysign" style={{width: "300px", height: "200px", textAlign: "center"}}>
      <hr />
      <h5>Imię i Nazwisko osoby upoważnionej<br /> do wystawienia faktury</h5>
    </div>
  }
}
 

class ClientSingature extends React.Component {
  render() { 
    return <div classNsme="clientsign" style={{ width: "300px", height: "200px", textAlign: "center"}}>
      <hr />
      <h5>Imię i Nazwisko osoby upoważnionej<br /> do odbioru faktury</h5>
    </div>
  }
}
 

class Footer extends React.Component {
  state = {  }
  render() { 
    return <div className="footer-wrap">
      <h1>FOOTER</h1>
      <MySignature />
      <ClientSingature />
    </div>
  }
}
 
export default Footer;
