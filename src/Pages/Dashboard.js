import React,{useEffect,useState} from "react";

import {
    MdBusiness,
    MdPayments,
    MdWarning,
    MdCheckCircle,
    MdAccessTime
} from "react-icons/md";


export default function Dashboard(){


const [stores,setStores]=useState([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

fetchStores();

},[]);



const fetchStores=async()=>{

try{


const response=await fetch(

"https://visiontrackdatabase.onrender.com/registration/stores"

);


const data=await response.json();


if(data.success){

setStores(data.data);

}


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};





// DASHBOARD CALCULATIONS


const totalStores = stores.length;



const activeStores = stores.filter(

item=>item.subscription_status==="ACTIVE"

).length;



const expiredStores = stores.filter(

item=>item.subscription_status!=="ACTIVE"

).length;





const totalRevenue = stores.reduce(

(sum,item)=>sum + Number(item.amount || 0),

0

);





const cards=[

{
title:"Total Stores",
value:totalStores,
icon:<MdBusiness/>
},


{
title:"Active Stores",
value:activeStores,
icon:<MdCheckCircle/>
},


{
title:"Expired Stores",
value:expiredStores,
icon:<MdWarning/>
},



{
title:"Monthly Revenue",
value:`₹ ${totalRevenue}`,
icon:<MdPayments/>
},


{
title:"Renewals Due",
value:
stores.filter(item=>item.expiry_date).length,
icon:<MdAccessTime/>
}


];





return(


<div className="dashboard">


<style>{`

.dashboard{

width:100%;

}



.page-title{

color:#0f172a;

font-size:26px;

font-weight:700;

margin-bottom:25px;

}



.cards{

display:grid;

grid-template-columns:repeat(4,1fr);

gap:20px;

}



.card{

background:white;

border-radius:16px;

padding:20px;

display:flex;

align-items:center;

justify-content:space-between;

box-shadow:0 5px 20px rgba(0,103,177,.08);

border:1px solid #e0efff;

}



.card-left h4{

margin:0;

color:#64748b;

font-size:14px;

}



.card-left h2{

margin-top:10px;

font-size:25px;

color:#0f172a;

}



.card-icon{

width:55px;

height:55px;

border-radius:14px;

display:flex;

align-items:center;

justify-content:center;

font-size:30px;

background:#eaf4ff;

color:#0067B1;

}




.section-grid{

margin-top:30px;

display:grid;

grid-template-columns:2fr 1fr;

gap:20px;

}



.box{

background:white;

border-radius:16px;

padding:20px;

border:1px solid #e0efff;

}



.box h3{

margin-top:0;

color:#0067B1;

}



.table-row{

display:flex;

justify-content:space-between;

padding:12px 0;

border-bottom:1px solid #eee;

font-size:14px;

}



.status{

padding:5px 10px;

border-radius:20px;

font-size:12px;

background:#dcfce7;

color:#15803d;

}



.warning{

background:#fee2e2;

color:#dc2626;

}




@media(max-width:1000px){

.cards{

grid-template-columns:repeat(2,1fr);

}

.section-grid{

grid-template-columns:1fr;

}

}



@media(max-width:600px){

.cards{

grid-template-columns:1fr;

}

}

`}</style>





<h1 className="page-title">

Dashboard

</h1>





{
loading ?

<h3>
Loading Dashboard...
</h3>

:

<>


<div className="cards">


{
cards.map((item,index)=>(


<div className="card" key={index}>


<div className="card-left">

<h4>
{item.title}
</h4>


<h2>
{item.value}
</h2>

</div>



<div className="card-icon">

{item.icon}

</div>


</div>


))

}

</div>







<div className="section-grid">



{/* Recent Stores */}

<div className="box">


<h3>
Recent Stores
</h3>


{

stores.slice(0,5).map(item=>(


<div className="table-row" key={item.id}>


<span>

{item.store_name}

</span>


<span className="status">

{item.subscription_status}

</span>


</div>


))

}



</div>






{/* Expiring Subscriptions */}


<div className="box">


<h3>
Expiring Subscriptions
</h3>



{

stores
.filter(item=>item.expiry_date)
.slice(0,5)
.map(item=>(


<div className="table-row" key={item.id}>


<span>

{item.store_name}

</span>


<span>

{
Math.ceil(

(new Date(item.expiry_date)-new Date())

/

(1000*60*60*24)

)

} Days

</span>


</div>


))

}



</div>




</div>


</>

}



</div>


);


}