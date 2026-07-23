import React, { useEffect, useState } from "react";


const API_URL = "https://visiontrackdatabase.onrender.com/orders";



const PurchaseOrders = () => {


const [orders,setOrders] = useState([]);

const [summary,setSummary] = useState({

total:0,
pending:0,
approved:0,
shipped:0,
completed:0

});


const [status,setStatus] = useState("All");

const [search,setSearch] = useState("");





// ==============================
// GET ORDERS
// ==============================

const getOrders = async()=>{


try{


let url = `${API_URL}/admin/all`;


if(status !== "All"){

url =
`${API_URL}/admin/status/${status}`;

}



const response =
await fetch(url);


const data =
await response.json();



if(data.success){

setOrders(data.data);

}


}

catch(error){

console.log(
"GET ORDERS ERROR",
error
);

}


};






// ==============================
// GET SUMMARY
// ==============================


const getSummary = async()=>{


try{


const response =
await fetch(
`${API_URL}/admin/summary`
);



const data =
await response.json();



if(data.success){

setSummary(data.data);

}


}

catch(error){

console.log(
"SUMMARY ERROR",
error
);


}


};







useEffect(()=>{


getOrders();


},[status]);



useEffect(()=>{


getSummary();


},[]);






// ==============================
// SEARCH
// ==============================


const filteredOrders = orders.filter(order=>{


return (

order.order_id
?.toLowerCase()
.includes(
search.toLowerCase()
)

||

order.store_code
?.toLowerCase()
.includes(
search.toLowerCase()
)


)


});






return (

<div style={styles.container}>


{/* HEADER */}


<div style={styles.header}>


<h2>
← Purchase Orders
</h2>



<div style={styles.search}>


<span>
🔍
</span>


<input

placeholder="Search"

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

/>


</div>


</div>







{/* SUMMARY CARDS */}


<div style={styles.summaryGrid}>


{


[

["Total Orders",summary.total],

["Pending",summary.pending],

["Approved",summary.approved],

["Shipped",summary.shipped],

["Completed",summary.completed]

]


.map((item,index)=>(



<div

key={index}

style={styles.summaryCard}

>


<p>
{item[0]}
</p>


<h2>
{item[1]}
</h2>


</div>



))


}



</div>








{/* STATUS FILTER */}



<div style={styles.filters}>


<b>
Status:
</b>



{


[
"All",
"Pending",
"Approved",
"Shipped",
"Completed"
]


.map(item=>(



<button


key={item}


onClick={()=>
setStatus(item)
}



style={{

...styles.filterBtn,


...(status===item &&
styles.active)

}}



>

{item}


</button>


))


}



</div>









{/* ORDER LIST */}



{

filteredOrders.map(order=>(




<div

key={order.order_id}

style={styles.orderCard}

>




<div style={styles.orderHeader}>


<h3>

{order.order_id}

</h3>




<span

style={{

...styles.status,


background:

order.status==="Pending"

?

"#fff3cd"


:

order.status==="Approved"


?

"#dbeafe"


:

order.status==="Shipped"


?

"#ede9fe"


:

"#dcfce7"


}}

>


{order.status}


</span>




</div>








<div style={styles.orderBody}>




<div>


<p>

Shop :

<b>
 {order.store_code}
</b>


</p>



<p>

{order.total_products || 0}

Products


</p>



</div>







<div style={styles.right}>


<h3>


₹

{order.total_amount}


</h3>



<p>


{

new Date(
order.created_at
)
.toLocaleDateString()

}



</p>





<button


style={styles.viewBtn}


onClick={async()=>{


const response =
await fetch(

`${API_URL}/admin/${order.order_id}`

);



const data =
await response.json();


console.log(
"ORDER DETAILS",
data
);


}}



>


👁 View


</button>



</div>





</div>





</div>




))


}





</div>

)

}









const styles={


container:{

padding:"25px",

background:"#f6f8fc",

minHeight:"100vh",

fontFamily:"Arial"

},



header:{


display:"flex",

justifyContent:"space-between",

alignItems:"center",

marginBottom:"25px"


},



search:{


background:"#fff",

padding:"10px 15px",

borderRadius:"10px",

border:"1px solid #ddd",

display:"flex",

gap:"10px"


},



summaryGrid:{


display:"grid",

gridTemplateColumns:"repeat(5,1fr)",

gap:"15px",

marginBottom:"25px"


},




summaryCard:{


background:"#fff",

padding:"18px",

borderRadius:"15px",

boxShadow:"0 3px 10px #ddd"


},




filters:{


display:"flex",

gap:"12px",

alignItems:"center",

marginBottom:"25px"


},




filterBtn:{


border:"1px solid #ddd",

background:"#fff",

padding:"8px 18px",

borderRadius:"20px",

cursor:"pointer"


},



active:{


background:"#2563eb",

color:"#fff"


},




orderCard:{


background:"#fff",

padding:"20px",

borderRadius:"15px",

marginBottom:"18px",

boxShadow:"0 3px 12px rgba(0,0,0,.08)"


},




orderHeader:{


display:"flex",

justifyContent:"space-between",

alignItems:"center"


},




status:{


padding:"6px 15px",

borderRadius:"20px",

fontSize:"13px",

fontWeight:"600"


},




orderBody:{


display:"flex",

justifyContent:"space-between",

marginTop:"15px"


},




right:{


textAlign:"right"


},




viewBtn:{


background:"#2563eb",

color:"#fff",

border:"none",

padding:"8px 18px",

borderRadius:"8px",

cursor:"pointer"


}



}



export default PurchaseOrders;