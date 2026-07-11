import React, { useState, useEffect } from "react";


export default function StoreList(){


const [search,setSearch]=useState("");

const [stores,setStores]=useState([]);

const [loading,setLoading]=useState(false);



useEffect(()=>{

fetchStores();

},[]);



const fetchStores=async()=>{

try{

setLoading(true);


const response=await fetch(
"https://visiontrackdatabase.onrender.com/registration/stores"
);


const result=await response.json();


if(result.success){

setStores(result.data);

}


}catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};




const formatDate=(date)=>{

if(!date) return "-";


return new Date(date).toLocaleDateString("en-IN",{

day:"2-digit",
month:"2-digit",
year:"numeric"

});


};





const filteredStores=stores.filter((store)=>{


const text=search.toLowerCase();


return (

store.store_name?.toLowerCase().includes(text) ||

store.owner_name?.toLowerCase().includes(text) ||

store.mobile?.includes(text) ||

store.store_code?.toLowerCase().includes(text)

);


});





return(

<div>


<style>{`

.store-page{

width:100%;

}



.header-section{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:25px;

}



.title{

font-size:25px;

font-weight:700;

color:#0f172a;

}



.add-btn{

background:#0067B1;

color:white;

border:none;

padding:12px 18px;

border-radius:10px;

cursor:pointer;

}



.search{

width:300px;

height:42px;

border:1px solid #dbeafe;

border-radius:10px;

padding:0 15px;

margin-bottom:20px;

}



.table-box{

background:white;

border-radius:15px;

overflow:auto;

border:1px solid #dbeafe;

}



table{

width:100%;

border-collapse:collapse;

}



th{

background:#eff6ff;

color:#0067B1;

padding:15px;

text-align:left;

}



td{

padding:15px;

border-bottom:1px solid #eee;

color:#334155;

}



.status{

padding:6px 12px;

border-radius:20px;

font-size:12px;

}



.active{

background:#dcfce7;

color:#15803d;

}



.expired{

background:#fee2e2;

color:#dc2626;

}



.action button{

margin-right:8px;

padding:7px 12px;

border:none;

border-radius:7px;

cursor:pointer;

}



.view{

background:#dbeafe;

color:#0067B1;

}



.edit{

background:#fef3c7;

}



@media(max-width:600px){


.header-section{

flex-direction:column;

align-items:flex-start;

gap:15px;

}


.search{

width:100%;

}

}


`}</style>





<div className="header-section">


<div className="title">

Store Management

</div>

{/* 
<button className="add-btn">

+ Add Store

</button> */}


</div>






<input

className="search"

placeholder="Search store name / owner / mobile"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>





<div className="table-box">


<table>


<thead>

<tr>

<th>Store Code</th>

<th>Store Name</th>

<th>Owner</th>

<th>Mobile</th>

<th>Plan</th>

<th>Amount</th>

<th>Expiry</th>

<th>Status</th>

{/* <th>Action</th> */}

</tr>

</thead>



<tbody>


{

loading ?


<tr>

<td colSpan="9" style={{textAlign:"center"}}>

Loading stores...

</td>

</tr>


:


filteredStores.map((store)=>(


<tr key={store.id}>


<td>

{store.store_code}

</td>



<td>

{store.store_name}

</td>



<td>

{store.owner_name}

</td>



<td>

{store.mobile}

</td>




<td>

{store.plan_name}

</td>




<td>

₹ {store.amount}

</td>





<td>

{formatDate(store.expiry_date)}

</td>





<td>


<span

className={`status ${
store.subscription_status==="ACTIVE"
?
"active"
:
"expired"
}`}

>

{store.subscription_status}

</span>


</td>





{/* <td className="action">


<button className="view">

View

</button>



<button className="edit">

Edit

</button>


</td> */}





</tr>


))


}




</tbody>


</table>


</div>





</div>


)

}