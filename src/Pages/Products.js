import React,{useState,useEffect} from "react";


function MasterProducts(){


const [categories,setCategories]=useState([]);
const [brands,setBrands]=useState([]);
const [products,setProducts]=useState([]);

const [image,setImage]=useState(null);
const [preview,setPreview]=useState("");

const [mobile,setMobile]=useState(false);



const [form,setForm]=useState({

category_id:"",
brand_id:"",
product_name:"",
description:"",
mrp:"",
sku:""

});





useEffect(()=>{

checkScreen();

window.addEventListener(
"resize",
checkScreen
);


loadCategories();
loadBrands();
loadProducts();


return()=>{

window.removeEventListener(
"resize",
checkScreen
);

};


},[]);





const checkScreen=()=>{

setMobile(window.innerWidth < 768);

};







const loadCategories=async()=>{


const res=await fetch(
"https://visiontrackdatabase.onrender.com/categories/all"
);


const data=await res.json();

setCategories(data.data || []);


};







const loadBrands=async()=>{


const res=await fetch(
"https://visiontrackdatabase.onrender.com/brands/all"
);


const data=await res.json();


setBrands(data.data || []);


};







const loadProducts=async()=>{


const res=await fetch(
"https://visiontrackdatabase.onrender.com/products/all"
);


const data=await res.json();


setProducts(data.data || []);


};







const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};







const handleImage=(e)=>{


const file=e.target.files[0];


if(file){

setImage(file);

setPreview(
URL.createObjectURL(file)
);


}


};









const saveProduct=async()=>{


try{


const formData=new FormData();


Object.keys(form).forEach(key=>{

formData.append(
key,
form[key]
);

});



if(image){

formData.append(
"image",
image
);

}




const res=await fetch(

"https://visiontrackdatabase.onrender.com/products/add",

{

method:"POST",

body:formData

}

);



const data=await res.json();



if(data.success){


alert("Product Added");


setForm({

category_id:"",
brand_id:"",
product_name:"",
description:"",
mrp:"",
sku:""

});


setImage(null);
setPreview("");


loadProducts();


}



}

catch(error){

console.log(error);

}


};









return(


<div style={styles.container}>


{/* HEADER */}

<div style={styles.header}>


<h2>
Master Product Management
</h2>


<p>
Manage optical products, brands and inventory catalog
</p>


</div>








{/* FORM */}


<div style={styles.card}>


<h3 style={styles.cardTitle}>
Add New Product
</h3>



<div
style={{
...styles.formGrid,

gridTemplateColumns:
mobile
?
"1fr"
:
"repeat(auto-fit,minmax(250px,1fr))"

}}
>



<select
style={styles.input}
name="category_id"
value={form.category_id}
onChange={handleChange}
>


<option value="">
Select Category
</option>


{
categories.map(c=>(

<option
key={c.id}
value={c.id}
>
{c.name}
</option>

))
}


</select>







<select
style={styles.input}
name="brand_id"
value={form.brand_id}
onChange={handleChange}
>


<option value="">
Select Brand
</option>


{
brands.map(b=>(

<option
key={b.id}
value={b.id}
>
{b.name}
</option>

))
}


</select>







<input
style={styles.input}
name="product_name"
placeholder="Product Name"
value={form.product_name}
onChange={handleChange}
/>







<input
style={styles.input}
name="mrp"
placeholder="MRP ₹"
value={form.mrp}
onChange={handleChange}
/>







<input
style={styles.input}
name="sku"
placeholder="SKU Code"
value={form.sku}
onChange={handleChange}
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
Upload Product Image
</span>

}



<input

type="file"

accept="image/*"

onChange={handleImage}

style={styles.fileInput}

/>


</label>



</div>








<textarea

style={styles.textarea}

name="description"

placeholder="Product Description"

value={form.description}

onChange={handleChange}

/>







<button

style={styles.button}

onClick={saveProduct}

>

+ Add Product

</button>





</div>









<h3 style={styles.heading}>
Products
</h3>







<div

style={{

...styles.grid,

gridTemplateColumns:

mobile

?

"1fr"

:

"repeat(auto-fit,minmax(260px,1fr))"


}}

>


{

products.map(p=>(


<div

key={p.id}

style={styles.productCard}

>



{
p.image &&

<img

src={p.image}

style={styles.productImage}

/>

}




<h3>
{p.product_name}
</h3>



<p style={styles.brand}>
{p.brand}
</p>



<p>

Category:

<b>
{" "}
{p.category}
</b>

</p>




<h2 style={styles.price}>

₹{p.mrp}

</h2>



<p style={styles.sku}>

SKU : {p.sku}

</p>



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

minHeight:"100vh",

boxSizing:"border-box"

},



header:{


background:"#1D4ED8",

padding:"22px",

borderRadius:"18px",

color:"#fff",

marginBottom:"25px"


},



card:{


background:"#fff",

padding:"22px",

borderRadius:"18px",

marginBottom:"30px",

boxShadow:"0 5px 15px rgba(0,0,0,.08)"

},




cardTitle:{


color:"#1D4ED8"

},



formGrid:{


display:"grid",

gap:"15px"

},





input:{


height:"45px",

padding:"0 15px",

border:"1px solid #CBD5E1",

borderRadius:"10px",

fontSize:"14px",

width:"100%",

boxSizing:"border-box"

},





uploadBox:{


height:"120px",

border:"2px dashed #2563EB",

borderRadius:"14px",

display:"flex",

alignItems:"center",

justifyContent:"center",

color:"#2563EB",

position:"relative",

overflow:"hidden",

cursor:"pointer"

},




fileInput:{


position:"absolute",

width:"100%",

height:"100%",

opacity:0


},





preview:{


width:"100%",

height:"100%",

objectFit:"contain"


},




textarea:{


width:"100%",

height:"90px",

marginTop:"15px",

padding:"15px",

borderRadius:"12px",

border:"1px solid #CBD5E1",

boxSizing:"border-box"


},




button:{


marginTop:"20px",

background:"#2563EB",

color:"#fff",

padding:"14px 35px",

border:"none",

borderRadius:"12px",

fontWeight:"700",

width:"100%",


},





heading:{


color:"#1E3A8A"

},





grid:{


display:"grid",

gap:"20px"

},






productCard:{


background:"#fff",

padding:"18px",

borderRadius:"18px",

boxShadow:"0 5px 15px rgba(0,0,0,.08)",

display:"flex",

flexDirection:"column",

alignItems:"center",

textAlign:"center"


},




imageBox:{


height:"180px",

background:"#EFF6FF",

borderRadius:"15px",

overflow:"hidden",

display:"flex",

justifyContent:"center",

alignItems:"center"


},




productImage:{


width:"100%",

height:"100%",

objectFit:"contain"


},





brand:{


color:"#2563EB",

fontWeight:"700"


},




price:{


color:"#16A34A"

},



sku:{


color:"#64748B"

}



};


export default MasterProducts;