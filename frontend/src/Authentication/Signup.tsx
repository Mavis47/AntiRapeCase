import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [age,setAge] = useState<number | "">("");
  const [productImage, setProductImage] = useState<File | null>();
  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target!.files!.length > 0) {
        setProductImage(e.target?.files?.[0]);
    }
  }

  const handleSignup = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("username", username);
    formData.append("fullname", fullname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("age", age.toString());
    formData.append("userProfilePic", productImage as File);
    
    try{
        const SignupData = await axios.post(`http://localhost:5001/api/auth/signup`,formData,
          {
            headers: {
              "Content-Type": "multipart/Form-data",
            },
          },
        );
        if(SignupData){
          alert('Registation Successfull')
          navigate('/login');
        }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Signup</h1>
      <form action="" onSubmit={handleSignup}>
        <input type="text" placeholder="Enter Username" onChange={(e) => {setUsername(e.target.value)}}/>
        <br />
        <input type="text" placeholder="Enter fullName" onChange={(e) => {setfullname(e.target.value)}}/>
        <br />
        <input type="text" placeholder="Enter email" onChange={(e) => {setemail(e.target.value)}}/>
        <br />
        <input type="text" placeholder="Enter password" onChange={(e) => {setpassword(e.target.value)}}/>
        <br />
        <input type="number" placeholder="Enter age" onChange={(e) => setAge(Number(e.target.value) || "")}/>
        <br />
        <input type="file" onChange={handleImageChange}/>
        <br />
        <a href="/login">Already Have An Account</a>
        <input type="submit" />
      </form>
    </div>
  );
}
