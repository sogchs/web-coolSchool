import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';
import logoCoolSchool from '../../logo-coolSchool.svg';
import authService from '../../services/auth-service';
import { withAuthConsumer } from '../../contexts/AuthStore';
import imagesAvatar from '../../data/imagesAvatar';
import randomObjProp from 'random-obj-prop';


// eslint-disable-next-line no-useless-escape
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


const validations = {
  email: (value) => {
    let message;
    if(!value){
      message = 'Email is required'
    }
    else if(!EMAIL_PATTERN.test(value)){
      message = 'Invalid email pattern '
    }
    return message;
  },
  password: (value) => {
    let message;
    if(!value){
      message = 'Password is required'
    }
    return message;
  },
  name: (value) => {
    let message;
    if(!value){
      message = 'Name is required'
    }
    return message;
  },
  surname: (value) => {
    let message;
    if(!value){
      message = 'Surname is required'
    }
    return message;
  },
  role: (value) => {
    let message;
    if(!value){
      message = 'Role is required'
    }
    return message;
  }
}
class Register extends Component {
  state = {
    user: {
      email: '',
      password: '',
      name: '',
      surname: '',
      role: '',
      imageURL: ''
    },
    errors: {
      email: validations.email(),
      password: validations.password(),
      name: validations.name(),
      surname: validations.surname(),
      role: validations.role()
    },
    touch: {},
    isRegistered: false
  }

  

  assignImageToUser = () => {
    if(this.state.user.role === 'student'){
      
      return randomObjProp(imagesAvatar);
    } 
    return "https://res.cloudinary.com/dkgr9dg9n/image/upload/v1553701128/coolSchool/web/default-user.jpg";   
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      user: {
        ...this.state.user,
        [name]: value
      },
      errors: {
        ...this.state.errors,
        [name]: validations[name] && validations[name](value)
      }
    })
  }

  handleBlur = (event) => {
    const { name } = event.target;
    this.setState({
      touch: {
        ...this.state.touch,
        [name]: true
      }
    })
  }

  handleSubmit = (event) => {
    const { user } = this.state;
    const imageURL = this.assignImageToUser();
    event.preventDefault();
    if(this.isValid()){
      authService.register({...user, imageURL})
        .then( (user) =>  this.setState({ isRegistered: true, user }, () => console.log(this.state)),
                (error) => {
                  const { errors, message } = error.response.data;
                  this.setState({
                    errors: {
                      ...errors,
                      email: !errors && message
                    },
                    touch: {
                      ...errors,
                      email: !errors && message
                    }
                  })
                }
      )
    }
  }

  isValid = () => {
    return !Object.keys(this.state.user)
    .some(attr => this.state.errors[attr])
  }


  render(){
    const { user, isRegistered, errors, touch } = this.state;

    if(isRegistered){
      return (<Redirect to='/login'/>)
    }

    return(
      <div className="login register shadow-sm">
        <div className="login-body">
            <img className="w-75 mx-auto my-3" src={logoCoolSchool} alt="Logo"/>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="emailRegister">Email</label>
                <input type="email" 
                  className={`form-control ${touch.email && errors.email && 'is-invalid'}`} 
                  id="emailRegister"
                  name="email"
                  placeholder="Email..."
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={user.email}
                  autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.email}</div>
              </div>
              <div className="form-group">
                <label htmlFor="passwordRegister">Password...</label>
                <input type="password" 
                  className={`form-control ${touch.password && errors.password && 'is-invalid'}`} 
                  id="passwordRegister"
                  name="password"
                  placeholder="Password..."
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={user.password}
                  autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.password}</div>
              </div>
              <div className="form-group">
                <label htmlFor="nameRegister">Name</label>
                <input type="text" 
                  className={`form-control ${touch.name && errors.name && 'is-invalid'}`} 
                  id="nameRegister" 
                  name="name"
                  placeholder="Name..."
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={user.name}
                  autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.name}</div>
              </div>
              <div className="form-group">
                <label htmlFor="surnameRegister">Surname</label>
                <input type="text"
                  className={`form-control ${touch.surname && errors.surname && 'is-invalid'}`} 
                  id="surnameRegister" 
                  name="surname"
                  placeholder="Surname..."
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  value={user.surname}
                  autoComplete="off"
                  />
                  <div className="invalid-feedback">{errors.surname}</div>
              </div>
              <div className="select-role-user">
              <div className="form-check form-check-inline">
                <input className={`form-check-input ${touch.role && errors.role && 'is-invalid'}`} 
                type="radio" 
                name="role" 
                id="roleRegister" 
                value="teacher"
                checked={user.role === "teacher"}
                onChange={this.handleChange}
                />
                <label className="form-check-label" htmlFor="roleRegister">Teacher</label>
              </div>
              <div className="form-check form-check-inline">
                <input className={`form-check-input ${touch.role && errors.role && 'custom-control-input'}`} 
                  type="radio" 
                  name="role" 
                  id="roleRegister2" 
                  value="student"
                  checked={user.role === "student"}
                  onChange={this.handleChange}
                  />
                <label className="form-check-label" htmlFor="roleRegister2">Student</label>
                <div className="invalid-feedback">{errors.role}</div>
              </div>
              </div>
                <button type="submit" className="btn btn-info w-100 mt-3">Register</button>
            </form>
            <p className="mx-auto mt-4">If you are "cool" <Link to='/login'> LOGIN </Link></p>        
        </div>
      </div>
    )
  }
}

export default withAuthConsumer(Register);