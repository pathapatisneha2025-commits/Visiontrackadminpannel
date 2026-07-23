import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function OpticalAdminLayout() {

  const navigate = useNavigate();

  const [sidebarOpen,setSidebarOpen] = useState(false);
  const [isMobile,setIsMobile] = useState(window.innerWidth <= 768);


  useEffect(()=>{

    const resize = ()=>{
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize",resize);

    return ()=>{
      window.removeEventListener("resize",resize);
    }

  },[]);



const logout = () => {

  // Remove stored login data
  localStorage.removeItem("admin");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("token");
  sessionStorage.clear();

  setSidebarOpen(false);

  // Redirect to Admin Login
  navigate("/adminlogin", { replace: true });

};



  const closeMenu=()=>{

    if(isMobile)
      setSidebarOpen(false);

  }



return (

<>

<style>{`

body{
 margin:0;
 font-family:Inter,Arial,sans-serif;
}


.optical-layout{

 display:flex;
 min-height:100vh;
 background:#f5f9ff;

}



/* SIDEBAR */

.optical-sidebar{

 width:250px;

 background:white;

 border-right:1px solid #dbeafe;

 padding:20px;

 transition:.3s;

}



.optical-logo{

 font-size:20px;
 font-weight:700;

 color:#0067B1;

 margin-bottom:35px;

}



.optical-menu a{

 display:block;

 padding:12px 15px;

 margin-bottom:10px;

 border-radius:10px;

 text-decoration:none;

 color:#334155;

 font-size:15px;

}



.optical-menu a:hover{

 background:#eff6ff;

 color:#0067B1;

}



.optical-menu a.active{

 background:#0067B1;

 color:white;

}



/* LOGOUT */


.logout{

 margin-top:40px;

 background:#ef4444;

 color:white;

 padding:12px;

 border-radius:10px;

 text-align:center;

 cursor:pointer;

}



/* CONTENT */


.optical-content{

 flex:1;

 padding:30px;

 overflow-y:auto;

}



/* MOBILE */


.mobile-topbar{

 display:flex;

 justify-content:space-between;

 align-items:center;

 background:#0067B1;

 color:white;

 padding:15px 20px;

}



.hamburger{

 font-size:25px;

 cursor:pointer;

}



@media(max-width:768px){


.optical-layout{

 flex-direction:column;

}



.optical-sidebar{

 position:fixed;

 top:0;

 left:0;

 height:100%;

 width:220px;

 z-index:1000;

 transform:translateX(${sidebarOpen ? "0":"-100%"});

 box-shadow:2px 0 10px rgba(0,0,0,.1);

}



.optical-content{

 padding:20px;

}



}



@media(min-width:769px){

.mobile-topbar{

 display:none;

}

}


`}</style>



<div className="optical-layout">


{/* MOBILE HEADER */}

{isMobile &&

<div className="mobile-topbar">

<div>
👁 Optical Super Admin
</div>


<div 
className="hamburger"
onClick={()=>setSidebarOpen(!sidebarOpen)}
>
☰
</div>


</div>

}



{/* SIDEBAR */}

<aside className="optical-sidebar">


<div className="optical-logo">

👁 VisionTrack Admin

</div>



<div className="optical-menu">


<NavLink 
to="/admin/dashboard"
onClick={closeMenu}
>
Dashboard
</NavLink>



<NavLink 
to="/admin/stores"
onClick={closeMenu}
>
Store Management
</NavLink>


{/* 
<NavLink 
to="/admin/users"
onClick={closeMenu}
>
User Management
</NavLink> */}



<NavLink 
to="/admin/subscriptions"
onClick={closeMenu}
>
Subscriptions
</NavLink>


<NavLink 
to="/admin/subscriptionsplans"
onClick={closeMenu}
>
Subscriptionsplans
</NavLink>



<NavLink 
to="/admin/Paymenthistory"
onClick={closeMenu}
>
Payments
</NavLink>

<NavLink 
to="/admin/categories"
onClick={closeMenu}
>
Categories
</NavLink>
<NavLink 
to="/admin/brands"
onClick={closeMenu}
>
Brands
</NavLink>
<NavLink 
to="/admin/products"
onClick={closeMenu}
>
Products
</NavLink>


<NavLink 
to="/admin/reports"
onClick={closeMenu}
>
Reports
</NavLink>



{/* <NavLink 
to="/admin/audit"
onClick={closeMenu}
>
Audit Logs
</NavLink> */}



<NavLink 
to="/admin/settings"
onClick={closeMenu}
>
Settings
</NavLink>


</div>




<div 
className="logout"
onClick={logout}
>
Logout
</div>



</aside>




{/* PAGE CONTENT */}


<main className="optical-content">

<Outlet />

</main>



</div>


</>


)

}