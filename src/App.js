import React, { Component } from 'react';
import { Table } from 'reactstrap'
import PropTypes from 'prop-types'
import validator from 'validator';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      nickname: '',
      email: '',
      ip: '',
      data: []
    };
    this.validationState = {
      email: false,
      ip: false
    };

    Table.propTypes = {
      tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
      size: PropTypes.string,
      bordered: PropTypes.bool,
      borderless: PropTypes.bool,
      striped: PropTypes.bool,
      dark: PropTypes.bool,
      hover: PropTypes.bool,
      responsive: PropTypes.bool,
      innerRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.object
      ])
    };

  }

  componentDidMount() {
    this.refs.userNickname.focus();
    this.validate();
    this.refs.deleteListBtn.hidden = true;
    this.refs.confirmModal.hidden = true;
  }

  validate() {
    const btn = this.refs.btn;
    btn.disabled = !(this.validationState.email && this.validationState.ip);
  }

  validateEmail() {
    let email = this.refs.userEmail ? this.refs.userEmail.value : '';
    let userEmailValidationMessage = this.refs.userEmailValidationMessage;
    userEmailValidationMessage.innerText = (email !== '' && !validator.isEmail(email))
      ? ' Your email is incorrect!'
      : '';

    this.validationState.email = validator.isEmail(email);
    this.validate();
  }

  validateIP() {
    let ip = this.refs.userIp ? this.refs.userIp.value : '';
    let userIpValidationMessage = this.refs.userIpValidationMessage;

    userIpValidationMessage.innerText = (ip !== '' && !validator.isIP(ip))
      ? ' Your IP Address is incorrect! '
      : '';

    this.validationState.ip = validator.isIP(ip);
    this.validate();
  }

  onChange(e) {
    this.setState({
      nickname: e.target.value
    });
  }

  validateUser(userNickname, userEmail, data) {
    for (const nickname in data) {
      if (data.hasOwnProperty(nickname)) {
        if (userNickname === data[nickname].name) {
          return 'User with this NICKNAME already exist!'
        }
      }
    }
    for (const email in data) {
      if (data.hasOwnProperty(email)) {
        if (userEmail === data[email].email) return 'User with this EMAIL already exist!';
      }
    }
    if(userNickname==='') return 'empty NICKNAME field!'; 
    if(userEmail==='') return 'empty EMAIL field!';
    return '';
  }

  removeUsersList(e) {
    this.refs.confirmModal.hidden = false;
    e.preventDefault();
  }

  hiddenModal(e) {
    this.refs.confirmModal.hidden = true;
    e.preventDefault();
  }

  removeUsersListApproved(e) {
    e.preventDefault();
    let data = this.state.data;
    data.splice(0, data.length);
    this.setState({
      data: data
    });
    this.refs.confirmModal.hidden = true;
    this.checkUsersState(data);
  }

  checkUsersState(data) {
    if (data.length === 0) {
      this.refs.deleteListBtn.hidden = true;
    }
  }

  compareName(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  compareEmail(a, b) {
    const emailA = a.email.toUpperCase();
    const emailB = b.email.toUpperCase();

    let comparison = 0;
    if (emailA > emailB) {
      comparison = 1;
    } else if (emailA < emailB) {
      comparison = -1;
    }
    return comparison;
  }

  compareIpAddress(a, b) {
    const ipA = a.ip.toUpperCase();
    const ipB = b.ip.toUpperCase();

    let comparison = 0;
    if (ipA > ipB) {
      comparison = 1;
    } else if (ipA < ipB) {
      comparison = -1;
    }
    return comparison;
  }

  compareSortName() {
    this.state.data.sort(this.compareName);
    this.setState({
      data: this.state.data
    });
  }

  compareSortEmail() {
    this.state.data.sort(this.compareEmail);
    this.setState({
      data: this.state.data
    });
  }

  compareSortIpAddress() {
    this.state.data.sort(this.compareIpAddress);
    this.setState({
      data: this.state.data
    });
  }

  addUser(e) {
    e.preventDefault();
    let name = this.refs.userNickname.value;
    let email = this.refs.userEmail.value;
    let ip = this.refs.userIp.value;
    let data = this.state.data;
    let dataset = {
      name, email, ip
    }
    let userValid = this.validateUser(name, email, data);
    if (userValid === '') {
      data.push(dataset);
      data.sort(this.compareName);
      this.setState({
        data: data
      });
      this.clearForm();
      this.refs.deleteListBtn.hidden = false;
      return true;
    } else {
      alert(userValid);
    }
  }

  clearForm() {
    this.refs.userForm.reset();
    this.refs.userNickname.focus();
  }

  removeUser = (i) => {
    let data = this.state.data;
    data.splice(i, 1);
    this.setState({
      data: data
    });
    this.clearForm();
    this.checkUsersState(data);
  }

  render() {
    let data = this.state.data;
    return (
      <div className="app-wrapper">
        <h1 className="app-title">Crypto users</h1>
        <form ref="userForm" className="user-form">
          <p className="user-form__field-name">Nickname</p>
          <input ref="userNickname" className="user-form__input" placeholder="your nickname" onChange={this.onChange}></input><br />
          <p className="user-form__field-name">Email</p>
          <input onKeyUp={() => this.validateEmail()} ref="userEmail" className="user-form__input" placeholder="your email" type="text"></input>
          <span className="user-form__valid-msg" ref="userEmailValidationMessage"></span>
          <p className="user-form__field-name">IP address</p>
          <input onKeyUp={() => this.validateIP()} ref="userIp" className="user-form__input" placeholder="your IP address" type="text"></input>
          <span className="user-form__valid-msg" ref="userIpValidationMessage"></span>
          <div className="user-form__buttons">
          <button ref="btn" onClick={(e) => this.addUser(e)} className="user-form__btn user-form__btn--add-user">Add User</button>
          <button ref="deleteListBtn" onClick={(e) => this.removeUsersList(e)} className="user-form__btn user-form__btn--delete-users-list">Delete List</button>
          </div>
          <div ref="confirmModal" className="user-form__modal-bg">
            <div className="user-form__modal-confirm">
              <p className="modal-confirm__delete-warning">Delete all users - are you sure?</p>
              <button ref="removeListConfirmBtn" onClick={(e) => this.removeUsersListApproved(e)} className="user-form__btn modal-confirm__btn--delete-confirm">YES</button>
              <button ref="removeListCancelBtn" onClick={(e) => this.hiddenModal(e)} className="user-form__btn modal__btn--close-modal">NO</button>
            </div>
          </div>
        </form>
        <Table className="table">
          <thead className="table__head">
            <tr >
              <th onClick={() => this.compareSortName()} className="table__head-col-name">Nickname</th>
              <th onClick={() => this.compareSortEmail()} className="table__head-col-name">Email</th>
              <th onClick={() => this.compareSortIpAddress()} className="table__head-col-name">IP Address</th>
            </tr>
          </thead>
          <tbody className="table__body">
            {
              data.map((dataset, i) =>
                <tr key={i} className="users-list">
                  <td><p > {dataset.name}</p></td>
                  <td><p> {dataset.email}</p></td>
                  <td><p > {dataset.ip} </p>
                    <button onClick={() => this.removeUser(i)} className="users-list__btn--remove-user">&#10006;</button></td>
                </tr>
              )}
          </tbody>
        </Table>
      </div>
    )
  };
}

export default App;
