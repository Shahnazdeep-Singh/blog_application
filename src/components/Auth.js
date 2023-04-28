import { Button, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import axios from "axios";
import { useDispatch } from 'react-redux';
import { authActions } from '../store';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();  //for updating the state in the redux
  const [inputs, setInputs] = useState({
    name:"", email:"", password:""
  });
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) =>{
    setInputs((prevState)=>({
      ...prevState,
      [e.target.name] : e.target.value
    }));
  };

  const sendRequest = async (type="login") => {
    const res = await axios.post(`http://localhost:5000/api/user/${type}`, {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password
    }).catch(err=>console.log(err));

    const data = await res.data;
    console.log(data);
    return data;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    if(isSignup){
      sendRequest("signup").then((data)=>localStorage.setItem("userId", data.user._id)).then(()=>dispatch(authActions.login())).then(()=>navigate("/blogs")).then((data)=>console.log(data))
    } else{
      sendRequest().then((data)=>localStorage.setItem("userId", data.user._id)).then(()=>dispatch(authActions.login())).then(()=>navigate("/blogs")).then((data)=>console.log(data));
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box maxWidth={400} display={"flex"} flexDirection={'column'} alignItems='center' justifyContent={'center'} boxShadow="10px 10px 20px #ccc" padding={3} margin="auto" marginTop={5} borderRadius={5}>
          <Typography padding={3} textAlign='center' variant='h2' color={'maroon'} >{isSignup ? "SignUp" : "Login"}</Typography>
          {isSignup && <TextField name='name' onChange={handleChange} value={inputs.name} placeholder='Username' margin="normal"/>}
          <TextField name='email' onChange={handleChange} value={inputs.email} type={'email'} placeholder='E-mail' margin="normal"/>
          <TextField name='password' onChange={handleChange} value={inputs.password} type={'password'} placeholder='Password' margin="normal"/>
          <Button type='submit' variant='contained' color="error" sx={{marginTop: 3}}>Submit</Button>
          <Button onClick={()=>setIsSignup(!isSignup)} variant='outlined' color='error'sx={{marginTop: 3}}>Click here to {isSignup ? "Login" : "Signup"}</Button>
        </Box>
      </form>
    </div>
  )
}

export default Auth