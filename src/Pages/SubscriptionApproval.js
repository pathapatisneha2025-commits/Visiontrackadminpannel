import React, { useEffect, useState } from "react";


export default function SubscriptionApproval(){


const [subscriptions,setSubscriptions]=useState([]);

const [loading,setLoading]=useState(false);



useEffect(()=>{

fetchSubscriptions();

},[]);




const BASE_URL=
"https://visiontrackdatabase.onrender.com";




const fetchSubscriptions=async()=>{


try{


setLoading(true);


const response=await fetch(

`${BASE_URL}/registration/stores`

);


const result=await response.json();



if(result.success){

setSubscriptions(result.data);

}



}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}


};





const approveSubscription=async(id)=>{


try{


await fetch(

`${BASE_URL}/registration/approve-subscription/${id}`,

{

method:"PUT"

}

);


alert("Subscription Approved");


fetchSubscriptions();



}
catch(error){

console.log(error);

}


};






const rejectSubscription=async(id)=>{


try{


await fetch(

`${BASE_URL}/registration/reject-subscription/${id}`,

{

method:"PUT"

}

);


alert("Subscription Rejected");


fetchSubscriptions();



}
catch(error){

console.log(error);

}


};






const formatDate=(date)=>{


if(!date) return "-";


return new Date(date).toLocaleDateString("en-IN");


};






return(


<div>


<style>{`

.page{

width:100%;

}


.title{

font-size:26px;

font-weight:700;

color:#0f172a;

margin-bottom:25px;

}



.card{

background:white;

border-radius:15px;

padding:20px;

border:1px solid #dbeafe;

overflow:auto;

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

background:#fef3c7;

color:#92400e;

}



.payment{

background:#dcfce7;

color:#15803d;

padding:6px 12px;

border-radius:20px;

font-size:12px;

}



button{

border:none;

padding:8px 14px;

border-radius:8px;

cursor:pointer;

margin-right:8px;

}



.approve{

background:#dcfce7;

color:#15803d;

}



.reject{

background:#fee2e2;

color:#dc2626;

}



.details{

background:#dbeafe;

color:#0067B1;

}



@media(max-width:700px){

.card{

overflow-x:auto;

}

}



`}</style>





<div className="page">


<div className="title">

Subscription Approval

</div>





<div className="card">


<table>


<thead>

<tr>

<th>Store Code</th>

<th>Store Name</th>

<th>Owner</th>

<th>Plan</th>

<th>Amount</th>

<th>Payment</th>

<th>Registered</th>

<th>Status</th>

<th>Action</th>

</tr>

</thead>




<tbody>



{

loading ?


<tr>

<td colSpan="9">

Loading...

</td>

</tr>



:


subscriptions.length===0 ?


<tr>

<td colSpan="9">

No pending subscriptions

</td>

</tr>



:


subscriptions.map((store)=>(


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

{store.plan_name}

</td>




<td>

₹ {store.amount}

</td>



<td>


<span className="payment">

{

store.razorpay_payment_id

?

"PAID"

:

"PENDING"

}

</span>


</td>




<td>

{formatDate(store.created_at)}

</td>




<td>


<span className="status">
{store.subscription_status}

</span>


</td>





<td>


<button

className="approve"

onClick={()=>approveSubscription(store.id)}

>

Approve

</button>




<button

className="reject"

onClick={()=>rejectSubscription(store.id)}

>

Reject

</button>




<button

className="details"

>

Details

</button>


</td>




</tr>


))


}




</tbody>


</table>


</div>


</div>



</div>


)


}