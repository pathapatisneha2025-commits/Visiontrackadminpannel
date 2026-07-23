import React,{useState,useEffect} from "react";


function Categories(){


const [name,setName]=useState("");

const [categories,setCategories]=useState([]);

const [loading,setLoading]=useState(false);



const [width,setWidth]=useState(window.innerWidth);



useEffect(()=>{


const resize=()=>setWidth(window.innerWidth);


window.addEventListener(
"resize",
resize
);


return()=>{

window.removeEventListener(
"resize",
resize
);

};


},[]);





const mobile = width < 600;

const tablet = width >=600 && width < 1024;






useEffect(()=>{

loadCategories();

},[]);






const loadCategories=async()=>{


try{


const res=await fetch(

"https://visiontrackdatabase.onrender.com/categories/all"

);


const data=await res.json();


setCategories(data.data || []);


}

catch(error){

console.log(error);

}


};







const addCategory=async()=>{


if(!name){

alert("Enter category name");

return;

}



try{


setLoading(true);



const res=await fetch(

"https://visiontrackdatabase.onrender.com/categories/add",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

name:name

})

}

);



const data=await res.json();



if(data.success){


alert("Category Added");


setName("");

loadCategories();


}


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}



};









return(


<div style={styles.container}>


{/* HEADER */}



<div style={styles.header}>


<h2 style={styles.headerTitle}>

Category Management

</h2>


<p style={styles.headerText}>

Manage optical product categories

</p>


</div>







{/* ADD CATEGORY */}



<div style={styles.card}>


<h3 style={styles.title}>

Add New Category

</h3>





<div

style={{

...styles.formRow,

flexDirection:

mobile

?

"column"

:

"row"

}}

>


<input


style={{

...styles.input,

width:

mobile

?

"100%"

:

tablet

?

"250px"

:

"300px"

}}


value={name}

placeholder="Enter Category Name"


onChange={

e=>setName(e.target.value)

}


/>






<button


style={{

...styles.button,

width:

mobile

?

"100%"

:

"auto"

}}


onClick={addCategory}

>


{

loading

?

"Saving..."

:

"+ Add Category"

}


</button>



</div>



</div>







{/* LIST TITLE */}



<h3 style={styles.heading}>

Categories

</h3>








{/* CATEGORY GRID */}



<div


style={{

...styles.grid,

gridTemplateColumns:

mobile

?

"1fr"

:

tablet

?

"repeat(2,1fr)"

:

"repeat(auto-fit,minmax(240px,1fr))"


}}


>



{

categories.map(item=>(


<div


key={item.id}


style={styles.categoryCard}


>




<div style={styles.iconBox}>

#

</div>





<div>


<h3 style={styles.categoryName}>

{item.name}

</h3>


<p style={styles.categoryId}>

Category ID : {item.id}

</p>


</div>





</div>


))


}




</div>







</div>


);


}









const styles={




container:{


padding:"clamp(15px,3vw,30px)",

background:"#F1F5F9",

minHeight:"100vh",

boxSizing:"border-box"


},






header:{


background:"#1D4ED8",

padding:"clamp(18px,3vw,30px)",

borderRadius:"18px",

color:"#fff",

marginBottom:"25px",

boxShadow:"0 5px 15px rgba(0,0,0,0.15)"


},





headerTitle:{


margin:0,

fontSize:"clamp(20px,3vw,28px)"

},




headerText:{


marginTop:"8px",

fontSize:"clamp(12px,2vw,16px)"

},







card:{


background:"#fff",

padding:"clamp(18px,3vw,25px)",

borderRadius:"18px",

marginBottom:"30px",

boxShadow:"0 5px 15px rgba(0,0,0,0.08)"

},





title:{


color:"#1D4ED8"

},







formRow:{


display:"flex",

gap:"15px",

flexWrap:"wrap"


},







input:{


height:"45px",

padding:"0 15px",

border:"1px solid #CBD5E1",

borderRadius:"10px",

fontSize:"14px",

outline:"none",

boxSizing:"border-box"


},






button:{


height:"45px",

padding:"0 30px",

background:"#2563EB",

color:"#fff",

border:"none",

borderRadius:"10px",

fontWeight:"700",

cursor:"pointer"


},







heading:{


color:"#1E3A8A",

marginBottom:"15px"


},







grid:{


display:"grid",

gap:"20px"


},






categoryCard:{


background:"#fff",

padding:"20px",

borderRadius:"16px",

display:"flex",

alignItems:"center",

gap:"15px",

boxShadow:"0 5px 15px rgba(0,0,0,0.08)",

minHeight:"90px"


},







iconBox:{


width:"50px",

height:"50px",

flexShrink:0,

borderRadius:"14px",

background:"#DBEAFE",

color:"#2563EB",

display:"flex",

alignItems:"center",

justifyContent:"center",

fontSize:"24px",

fontWeight:"900"


},







categoryName:{


margin:0,

fontSize:"16px",

color:"#0F172A"


},




categoryId:{


marginTop:"5px",

fontSize:"13px",

color:"#64748B"


}



};



export default Categories;