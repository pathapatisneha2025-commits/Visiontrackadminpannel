import React,{useEffect,useState} from "react";


export default function SuperAdminReports(){


const [stores,setStores]=useState([]);

const [payments,setPayments]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

fetchReports();

},[]);





const fetchReports=async()=>{

try{


setLoading(true);



const storeRes=await fetch(

"https://visiontrackdatabase.onrender.com/registration/stores"

);


const storeData=await storeRes.json();



if(storeData.success){

setStores(storeData.data);

}







const paymentRes=await fetch(

"https://visiontrackdatabase.onrender.com/registration/payment-history/all"

);


const paymentData=await paymentRes.json();



if(paymentData.success){

setPayments(paymentData.data);

}



}
catch(error){

console.log("Report Error:",error);

}
finally{

setLoading(false);

}


};







// SUCCESS PAYMENTS

const successPayments = payments.filter(

item =>
item.payment_status?.toUpperCase()==="SUCCESS"

);






// FAILED PAYMENTS

const failedPayments = payments.filter(

item =>
item.payment_status?.toUpperCase()==="FAILED"

);







// TOTAL REVENUE

const totalRevenue = successPayments.reduce(

(sum,item)=>

sum + Number(item.amount || 0),

0

);








// MONTHLY REVENUE


const today=new Date();


const monthlyRevenue = successPayments.filter(item=>{


const date=new Date(item.created_at);


return (

date.getMonth()===today.getMonth()

&&

date.getFullYear()===today.getFullYear()

);


})
.reduce(

(sum,item)=>

sum + Number(item.amount || 0),

0

);









// YEARLY REVENUE


const yearlyRevenue = successPayments.filter(item=>{


const date=new Date(item.created_at);


return (

date.getFullYear()===today.getFullYear()

);


})
.reduce(

(sum,item)=>

sum + Number(item.amount || 0),

0

);









// PLAN WISE REVENUE


const planReport={};



successPayments.forEach(item=>{


const plan=item.plan_name || "Unknown";



if(!planReport[plan]){

planReport[plan]=0;

}



planReport[plan]+=Number(item.amount || 0);



});








if(loading){


return (

<div style={{padding:30,fontSize:20}}>

Loading Reports...

</div>

)


}








return(


<div>


<style>{`

.report-title{

font-size:28px;

font-weight:700;

color:#0f172a;

margin-bottom:25px;

}



.report-grid{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:20px;

}



.report-card{

background:white;

padding:25px;

border-radius:16px;

border:1px solid #e0efff;

box-shadow:0 5px 20px rgba(0,103,177,.08);

}



.report-card h4{

color:#64748b;

margin:0;

font-size:14px;

}



.report-card h2{

margin-top:15px;

font-size:26px;

color:#0067B1;

}



.section{

margin-top:30px;

background:white;

padding:20px;

border-radius:16px;

border:1px solid #e0efff;

}



.section h3{

margin-top:0;

color:#0067B1;

}



.row{

display:flex;

justify-content:space-between;

padding:12px 0;

border-bottom:1px solid #eee;

}



.empty{

color:#777;

padding:15px 0;

}



@media(max-width:900px){

.report-grid{

grid-template-columns:repeat(2,1fr);

}

}



@media(max-width:600px){

.report-grid{

grid-template-columns:1fr;

}

}


`}</style>






<h1 className="report-title">

Revenue Reports

</h1>








<div className="report-grid">





<div className="report-card">

<h4>
Total Revenue
</h4>

<h2>

₹ {totalRevenue}

</h2>

</div>







<div className="report-card">

<h4>
Monthly Revenue
</h4>

<h2>

₹ {monthlyRevenue}

</h2>

</div>







<div className="report-card">

<h4>
Yearly Revenue
</h4>

<h2>

₹ {yearlyRevenue}

</h2>

</div>







<div className="report-card">

<h4>
Total Stores
</h4>

<h2>

{stores.length}

</h2>

</div>






</div>









<div className="section">


<h3>

Plan Wise Revenue

</h3>




{

Object.keys(planReport).length===0 ?


<div className="empty">

No Revenue Data

</div>


:


Object.keys(planReport).map(plan=>(


<div className="row" key={plan}>


<span>

{plan}

</span>



<strong>

₹ {planReport[plan]}

</strong>


</div>


))


}



</div>









<div className="section">


<h3>

Payment Status Report

</h3>





<div className="row">


<span>

Successful Payments

</span>


<strong>

{successPayments.length}

</strong>


</div>






<div className="row">


<span>

Failed Payments

</span>


<strong>

{failedPayments.length}

</strong>


</div>





</div>






</div>


);


}