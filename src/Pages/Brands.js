import React, { useState, useEffect } from "react";


function Brands() {


const [name,setName] = useState("");

const [logo,setLogo] = useState(null);

const [preview,setPreview] = useState("");

const [brands,setBrands] = useState([]);

const [loading,setLoading] = useState(false);




// LOAD BRANDS

useEffect(()=>{

loadBrands();

},[]);




const loadBrands = async()=>{


try{


const res = await fetch(

"https://visiontrackdatabase.onrender.com/brands/all"

);


const data = await res.json();


if(data.success){

setBrands(data.data);

}


}
catch(error){

console.log(error);

}


};





// IMAGE SELECT


const handleImage=(e)=>{


const file=e.target.files[0];


if(file){


setLogo(file);


setPreview(

URL.createObjectURL(file)

);


}


};






// ADD BRAND


const addBrand = async()=>{


if(!name){

alert("Enter brand name");

return;

}



try{


setLoading(true);



const formData = new FormData();


formData.append(

"name",

name

);



if(logo){

formData.append(

"logo",

logo

);

}




const res = await fetch(

"https://visiontrackdatabase.onrender.com/brands/add",

{

method:"POST",

body:formData

}

);



const data = await res.json();




if(data.success){


alert("Brand Added");


setName("");

setLogo(null);

setPreview("");



loadBrands();


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


<div style={styles.header}>


<h2>

Brand Management

</h2>


<p>

Manage optical brands and logos

</p>


</div>





{/* ADD BRAND CARD */}


<div style={styles.formCard}>


<h3>

Add New Brand

</h3>



<div style={styles.formGrid}>


<input

style={styles.input}

placeholder="Brand Name"

value={name}

onChange={(e)=>

setName(e.target.value)

}

/>



<label style={styles.uploadBox}>


{

preview ?


<img

src={preview}

style={styles.preview}

/>


:

<span>

Upload Logo

</span>


}



<input

type="file"

accept="image/*"

onChange={handleImage}

style={styles.file}

/>


</label>



</div>




<button

style={styles.button}

onClick={addBrand}

disabled={loading}

>


{

loading ?

"Saving..."

:

"Add Brand"

}


</button>



</div>







{/* BRAND LIST */}



<h3 style={styles.title}>

Brands

</h3>




<div style={styles.grid}>


{

brands.map(item=>(


<div

key={item.id}

style={styles.brandCard}

>



<div style={styles.imageBox}>


{

item.logo &&


<img

src={item.logo}

style={styles.logo}

/>


}


</div>



<div>


<h4>

{item.name}

</h4>


<p>

Brand ID : {item.id}

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


padding:"20px",

background:"#F1F5F9",

minHeight:"100vh"

},



header:{


background:"#2563EB",

padding:"20px",

borderRadius:"16px",

color:"#fff",

marginBottom:"20px"


},



formCard:{


background:"#fff",

padding:"20px",

borderRadius:"16px",

boxShadow:"0 4px 12px rgba(0,0,0,0.08)",

marginBottom:"25px"


},




formGrid:{


display:"flex",

gap:"15px",

flexWrap:"wrap",

alignItems:"center"


},




input:{


height:"45px",

padding:"0 15px",

border:"1px solid #CBD5E1",

borderRadius:"10px",

fontSize:"14px",

width:"260px",

outline:"none"


},




uploadBox:{


width:"120px",

height:"80px",

border:"2px dashed #94A3B8",

borderRadius:"12px",

display:"flex",

justifyContent:"center",

alignItems:"center",

cursor:"pointer",

overflow:"hidden",

position:"relative",

color:"#64748B"


},



file:{


position:"absolute",

opacity:0,

width:"100%",

height:"100%",

cursor:"pointer"


},



preview:{


width:"100%",

height:"100%",

objectFit:"contain"


},




button:{


marginTop:"20px",

padding:"12px 30px",

background:"#2563EB",

color:"#fff",

border:"none",

borderRadius:"10px",

fontWeight:"700",

cursor:"pointer"


},




title:{


marginTop:"20px"


},





grid:{


display:"grid",

gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",

gap:"20px"


},




brandCard:{


background:"#fff",

padding:"18px",

borderRadius:"16px",

display:"flex",

alignItems:"center",

gap:"15px",

boxShadow:"0 3px 10px rgba(0,0,0,0.08)"


},




imageBox:{


width:"70px",

height:"70px",

borderRadius:"12px",

background:"#F8FAFC",

display:"flex",

alignItems:"center",

justifyContent:"center",

overflow:"hidden"


},



logo:{


width:"100%",

height:"100%",

objectFit:"contain"


}



};



export default Brands;