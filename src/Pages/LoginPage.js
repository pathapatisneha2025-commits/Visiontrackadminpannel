import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


export default function AdminLogin(){

    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [showPassword,setShowPassword] = useState(false);

const handleLogin = async (e) => {

    e.preventDefault();

    if(!email || !password){
        alert("Please enter email/mobile and password");
        return;
    }


    try{

        const response = await fetch(
            "https://partyhousedatabase-rpft.onrender.com/admin/login",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({

                    email:email,
                    password:password

                })
            }
        );


        const data = await response.json();


        console.log("Login Response:",data);



    if(data.message === "Login successful" && data.admin){

    localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
    );


    navigate("/admin/dashboard");

}
else{

    alert(data.message || "Invalid login credentials");

}


    }
    catch(error){

        console.log("Login Error:",error);

        alert("Server error. Please try again");

    }


}


return(

<div className="login-page">


<style>{`

*{
 box-sizing:border-box;
}


body{
 margin:0;
 font-family:Inter,Arial,sans-serif;
}



.login-page{

 min-height:100vh;

 display:flex;

 justify-content:center;

 align-items:center;

 background:#f1f7ff;

 padding:20px;

}



/* CARD */

.login-card{

 width:100%;

 max-width:420px;

 background:white;

 border-radius:20px;

 padding:35px;

 box-shadow:0 10px 30px rgba(0,103,177,.15);

}



/* LOGO */

.logo-section{

 text-align:center;

 margin-bottom:30px;

}


.logo{

 width:70px;

 height:70px;

 border-radius:50%;

 background:#0067B1;

 color:white;

 display:flex;

 justify-content:center;

 align-items:center;

 font-size:35px;

 margin:auto;

}



.title{

 margin-top:15px;

 color:#0067B1;

 font-size:24px;

 font-weight:700;

}


.subtitle{

 color:#64748b;

 font-size:14px;

}





/* INPUT */


.input-group{

 margin-bottom:20px;

}


label{

 display:block;

 font-size:14px;

 color:#334155;

 margin-bottom:7px;

 font-weight:600;

}



input{

 width:100%;

 height:48px;

 border:1px solid #dbeafe;

 border-radius:10px;

 padding:0 15px;

 font-size:15px;

 outline:none;

}



input:focus{

 border-color:#0067B1;

 box-shadow:0 0 0 3px rgba(0,103,177,.1);

}





.password-box{

 position:relative;

}


.show-btn{

 position:absolute;

 right:15px;

 top:13px;

 cursor:pointer;

 color:#0067B1;

 font-size:13px;

}





/* BUTTON */


.login-btn{

 width:100%;

 height:50px;

 background:#0067B1;

 color:white;

 border:none;

 border-radius:12px;

 font-size:16px;

 font-weight:600;

 cursor:pointer;

 margin-top:10px;

}



.login-btn:hover{

 background:#00508a;

}



.forgot{

 text-align:right;

 margin-top:15px;

 color:#0067B1;

 font-size:14px;

 cursor:pointer;

}




/* MOBILE */

@media(max-width:480px){


.login-card{

 padding:25px;

 border-radius:15px;

}


.title{

 font-size:21px;

}


}

`}</style>




<div className="login-card">



<div className="logo-section">


<div className="logo">

👁

</div>


<div className="title">

VisionTrack

</div>


<div className="subtitle">

Optical Super Admin Portal

</div>


</div>





<form onSubmit={handleLogin}>


<div className="input-group">

<label>
Email / Mobile
</label>


<input

type="text"

placeholder="Enter email or mobile"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>


</div>






<div className="input-group">


<label>
Password
</label>


<div className="password-box">


<input

type={showPassword ? "text":"password"}

placeholder="Enter password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>


<span

className="show-btn"

onClick={()=>setShowPassword(!showPassword)}

>

{
showPassword ? "Hide":"Show"
}

</span>


</div>


</div>





<button className="login-btn">

Login

</button>




<div

className="forgot"

onClick={()=>navigate("/forgotpassword")}

>

Forgot Password?

</div>




</form>



</div>



</div>

)

}