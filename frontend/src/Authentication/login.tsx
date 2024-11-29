import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const handlelogin = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const login_data = await axios.post("http://localhost:5001/api/auth/login",{username,password},{
      withCredentials: true
    });
     if(login_data){
        console.log(login_data);
        alert('Logged-In Successfully');
        navigate('/layout');
     }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handlelogin}>
        <input type="text" placeholder="Enter Username" onChange={(e) => {setUsername(e.target.value)}}/><br />
        <input type="password" placeholder="Enter Password" onChange={(e) => {setPassword(e.target.value)}}/><br />
        <a href="/signup">Don't have an Account</a>
        <input type="submit" />
      </form>
    </div>
  )
}
