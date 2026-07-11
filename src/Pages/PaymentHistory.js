import React, {useEffect, useState} from "react";


export default function SuperAdminPaymentHistory(){

const [payments,setPayments] = useState([]);
const [filtered,setFiltered] = useState([]);
const [loading,setLoading] = useState(true);
const [search,setSearch] = useState("");



useEffect(()=>{

fetchPayments();

},[]);



const fetchPayments = async()=>{

try{

setLoading(true);


const response = await fetch(
"https://visiontrackdatabase.onrender.com/registration/payment-history/all"
);


const data = await response.json();


if(data.success){

setPayments(data.data);

setFiltered(data.data);

}


}
catch(error){

console.log("Payment History Error:",error);

}
finally{

setLoading(false);

}

};





const handleSearch=(text)=>{

setSearch(text);


if(!text){

setFiltered(payments);

return;

}


const result = payments.filter(item=>

item.store_code
?.toLowerCase()
.includes(text.toLowerCase())

||

item.plan_name
?.toLowerCase()
.includes(text.toLowerCase())

||

item.payment_status
?.toLowerCase()
.includes(text.toLowerCase()))

;


setFiltered(result);

};





return(

<>

<style>{`

.payment-container{

padding:25px;

background:#f5f8fc;

min-height:100vh;

font-family:Arial, sans-serif;

}



.payment-container h2{

font-size:28px;

font-weight:700;

color:#12345B;

margin-bottom:20px;

}



.payment-search{

width:100%;

max-width:450px;

height:45px;

padding:0 15px;

border-radius:10px;

border:1px solid #ddd;

background:#fff;

font-size:15px;

margin-bottom:25px;

outline:none;

}



.payment-search:focus{

border-color:#0067B1;

}



.payment-grid{

display:grid;

grid-template-columns:
repeat(auto-fit,minmax(320px,1fr));

gap:20px;

}



.payment-card{

background:#fff;

border-radius:16px;

padding:20px;

box-shadow:
0px 5px 20px rgba(0,0,0,0.08);

transition:.3s;

}



.payment-card:hover{

transform:translateY(-3px);

}



.payment-row{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:14px;

font-size:14px;

}



.payment-row span:first-child{

color:#666;

}



.payment-row strong{

color:#222;

font-weight:600;

text-align:right;

max-width:60%;

word-break:break-word;

}



.amount{

font-size:20px;

color:#0067B1 !important;

}



.status{

padding:6px 14px;

border-radius:20px;

font-size:12px;

font-weight:700;

text-transform:uppercase;

}



.success{

background:#D1FAE5;

color:#047857;

}



.failed{

background:#FEE2E2;

color:#DC2626;

}



.date{

border-top:1px solid #eee;

padding-top:12px;

margin-top:15px;

font-size:12px;

color:#777;

}



.loader{

font-size:18px;

color:#0067B1;

font-weight:600;

}



.empty{

background:#fff;

padding:30px;

border-radius:12px;

text-align:center;

color:#777;

font-size:16px;

}



/* Mobile Responsive */

@media(max-width:600px){

.payment-container{

padding:15px;

}



.payment-container h2{

font-size:22px;

}



.payment-grid{

grid-template-columns:1fr;

}



.payment-row{

font-size:13px;

}

}


`}</style>



<div className="payment-container">


<h2>
Payment History
</h2>



<input

className="payment-search"

placeholder="Search store, plan or status"

value={search}

onChange={(e)=>handleSearch(e.target.value)}

/>




{
loading ?

<div className="loader">

Loading Payments...

</div>


:


<div className="payment-grid">


{
filtered.length===0 ?


<div className="empty">

No Payments Found

</div>


:


filtered.map((item)=>(


<div className="payment-card" key={item.id}>


<div className="payment-row">

<span>
Store Code
</span>

<strong>
{item.store_code}
</strong>

</div>



<div className="payment-row">

<span>
Plan
</span>

<strong>
{item.plan_name}
</strong>

</div>




<div className="payment-row">

<span>
Invoice
</span>

<strong>
{item.invoice_no || "-"}
</strong>

</div>




<div className="payment-row">

<span>
Transaction ID
</span>

<strong>
{item.transaction_id || "-"}
</strong>

</div>



<div className="payment-row">

<span>
Payment Method
</span>

<strong>
{item.payment_method || "-"}
</strong>

</div>



<div className="payment-row">

<span>
Amount
</span>

<strong className="amount">

₹ {item.amount}

</strong>

</div>



<div className="payment-row">

<span>
Status
</span>


<span

className={
item.payment_status==="success"
?
"status success"
:
"status failed"
}

>

{item.payment_status}

</span>


</div>



<div className="date">

{
new Date(item.created_at)
.toLocaleString()
}

</div>



</div>


))


}



</div>


}



</div>


</>

);


}