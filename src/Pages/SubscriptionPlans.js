import React,{useState,useEffect} from "react";


export default function SubscriptionPlans(){


const BASE_URL="https://visiontrackdatabase.onrender.com";


const [plans,setPlans]=useState([]);

const [loading,setLoading]=useState(false);

const [showModal,setShowModal]=useState(false);

const [editId,setEditId]=useState(null);



const [form,setForm]=useState({

plan_name:"",
price:"",
duration_days:"",
features:"",
status:"ACTIVE"

});





useEffect(()=>{

fetchPlans();

},[]);





const fetchPlans=async()=>{

try{

setLoading(true);


const response=await fetch(

`${BASE_URL}/subscriptionplans/all`

);


const result=await response.json();


if(result.success){

setPlans(result.data);

}


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};






const openAdd=()=>{


setEditId(null);


setForm({

plan_name:"",
price:"",
duration_days:"",
features:"",
status:"ACTIVE"

});


setShowModal(true);


};







const openEdit=(plan)=>{


setEditId(plan.id);


setForm({

plan_name:plan.plan_name,

price:plan.price,

duration_days:plan.duration_days,

features:plan.features.join("\n"),

status:plan.status

});


setShowModal(true);


};









const savePlan=async()=>{


try{


const payload={


plan_name:form.plan_name,


price:Number(form.price),


duration_days:Number(form.duration_days),


features:
form.features
.split("\n")
.filter(x=>x.trim()),


status:form.status


};





let url="";

let method="";



if(editId){


url=`${BASE_URL}/subscriptionplans/${editId}`;

method="PUT";


}
else{


url=`${BASE_URL}/subscriptionplans/add`;

method="POST";


}







const response=await fetch(url,{

method,

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(payload)

});



const result=await response.json();



if(result.success){


alert(

editId

?

"Plan Updated Successfully"

:

"Plan Added Successfully"

);


setShowModal(false);


fetchPlans();


}



}
catch(error){

console.log(error);

}


};









const changeStatus=async(plan)=>{


try{


const response=await fetch(

`${BASE_URL}/subscriptionplans/toggle/${plan.id}`,

{

method:"PUT"

}

);



const result=await response.json();



if(result.success){


alert(

plan.status==="ACTIVE"

?

"Plan Deactivated"

:

"Plan Activated"

);


fetchPlans();


}


}
catch(error){

console.log(error);

}


};









const deletePlan=async(id)=>{


if(!window.confirm("Delete this plan?"))

return;



try{


const response=await fetch(

`${BASE_URL}/subscriptionplans/${id}`,

{

method:"DELETE"

}

);



const result=await response.json();



if(result.success){


alert("Plan Deleted");


fetchPlans();


}



}
catch(error){

console.log(error);

}


};









return(

<div>


<style>{`

.page{

width:100%;

}



.header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:25px;

}



.title{

font-size:26px;

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



.cards{

display:grid;

grid-template-columns:repeat(auto-fit,minmax(280px,1fr));

gap:20px;

}



.card{

background:white;

border:1px solid #dbeafe;

border-radius:18px;

padding:22px;

}



.plan-name{

font-size:22px;

font-weight:700;

color:#0067B1;

}



.price{

font-size:30px;

font-weight:700;

margin:15px 0;

}



.duration{

color:#64748b;

}



.feature{

padding:6px 0;

}



.status{

display:inline-block;

padding:6px 12px;

border-radius:20px;

font-size:12px;

margin-top:15px;

}



.active{

background:#dcfce7;

color:#15803d;

}



.inactive{

background:#fee2e2;

color:#dc2626;

}



.actions{

margin-top:20px;

}



.actions button{

padding:8px 12px;

border:none;

border-radius:8px;

margin-right:6px;

cursor:pointer;

}



.edit{

background:#fef3c7;

}



.toggle{

background:#dbeafe;

color:#0067B1;

}



.delete{

background:#fee2e2;

color:#dc2626;

}



.modal{

position:fixed;

top:0;

left:0;

right:0;

bottom:0;

background:rgba(0,0,0,.4);

display:flex;

align-items:center;

justify-content:center;

}



.box{

background:white;

padding:25px;

border-radius:15px;

width:350px;

}



.box input,

.box textarea{

width:100%;

padding:10px;

margin-bottom:12px;

border:1px solid #ddd;

border-radius:8px;

}



.save{

background:#0067B1;

color:white;

padding:10px 20px;

border:none;

border-radius:8px;

cursor:pointer;

}



.cancel{

background:#ddd;

padding:10px 20px;

border:none;

border-radius:8px;

cursor:pointer;

}


`}</style>







<div className="page">


<div className="header">


<div className="title">

Subscription Plans

</div>



<button

className="add-btn"

onClick={openAdd}

>

+ Add Plan

</button>



</div>







{

loading

?

<div>

Loading...

</div>


:

<div className="cards">


{

plans.map(plan=>(


<div className="card" key={plan.id}>


<div className="plan-name">

{plan.plan_name}

</div>



<div className="price">

₹ {plan.price}

</div>



<div className="duration">

Duration : {plan.duration_days} Days

</div>



<hr/>





{

plan.features?.map((f,i)=>(

<div

className="feature"

key={i}

>

✓ {f}

</div>

))

}





<span

className={`status ${
plan.status==="ACTIVE"
?
"active"
:
"inactive"
}`}

>

{plan.status}

</span>






<div className="actions">



<button

className="edit"

onClick={()=>openEdit(plan)}

>

Edit

</button>





<button

className="toggle"

onClick={()=>changeStatus(plan)}

>


{

plan.status==="ACTIVE"

?

"Deactivate"

:

"Activate"

}


</button>





<button

className="delete"

onClick={()=>deletePlan(plan.id)}

>

Delete

</button>



</div>




</div>


))


}


</div>


}








{

showModal &&


<div className="modal">


<div className="box">


<h3>

{

editId

?

"Edit Plan"

:

"Add Plan"

}

</h3>





<input

placeholder="Plan Name"

value={form.plan_name}

onChange={e=>

setForm({

...form,

plan_name:e.target.value

})

}

/>





<input

placeholder="Price"

value={form.price}

onChange={e=>

setForm({

...form,

price:e.target.value

})

}

/>





<input

placeholder="Duration Days"

value={form.duration_days}

onChange={e=>

setForm({

...form,

duration_days:e.target.value

})

}

/>






<textarea

rows="5"

placeholder="Features one per line"

value={form.features}

onChange={e=>

setForm({

...form,

features:e.target.value

})

}

/>





<button

className="save"

onClick={savePlan}

>

Save

</button>





<button

className="cancel"

onClick={()=>setShowModal(false)}

>

Cancel

</button>





</div>


</div>


}






</div>


</div>


)

}