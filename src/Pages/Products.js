import React,{useState,useEffect} from "react";

function MasterProducts(){

const [categories,setCategories]=useState([]);
const [brands,setBrands]=useState([]);
const [products,setProducts]=useState([]);

const [mobile,setMobile]=useState(false);

// EDIT STATE
const [editId,setEditId]=useState(null);

const [form,setForm]=useState({
category_id:"",
brand_id:"",
product_name:"",
description:"",
variants:[
{
color:"",
price:"",
sku:"",
image:null,
preview:""
}
]
});

useEffect(()=>{
checkScreen();
window.addEventListener("resize",checkScreen);
loadCategories();
loadBrands();
loadProducts();

return()=>{
window.removeEventListener("resize",checkScreen);
};
},[]);

const checkScreen=()=>{
setMobile(window.innerWidth < 768);
};

const loadCategories=async()=>{
const res=await fetch("https://visiontrackdatabase.onrender.com/categories/all");
const data=await res.json();
setCategories(data.data || []);
};

const loadBrands=async()=>{
const res=await fetch("https://visiontrackdatabase.onrender.com/brands/all");
const data=await res.json();
setBrands(data.data || []);
};

const loadProducts=async()=>{
const res=await fetch("https://visiontrackdatabase.onrender.com/products/all");
const data=await res.json();
setProducts(data.data || []);
};

const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const addVariant=()=>{
setForm({
...form,
variants:[
...form.variants,
{
color:"",
price:"",
sku:"",
image:null,
preview:""
}
]
});
};

const updateVariant=(index,key,value)=>{
let updated=[...form.variants];
updated[index][key]=value;
setForm({
...form,
variants:updated
});
};

const handleVariantImage=(index,e)=>{
const file=e.target.files[0];
if(file){
let updated=[...form.variants];
updated[index].image=file;
updated[index].preview=URL.createObjectURL(file);
setForm({
...form,
variants:updated
});
}
};

const removeVariant=(index)=>{
let updated=form.variants.filter((_,i)=>i!==index);
setForm({
...form,
variants:updated
});
};

// ==============================
// ADD PRODUCT
// ==============================

const saveProduct=async()=>{
try{
const formData=new FormData();

formData.append("category_id",form.category_id);
formData.append("brand_id",form.brand_id);
formData.append("product_name",form.product_name);
formData.append("description",form.description);

const variantsMeta=form.variants.map(v=>({
color:v.color,
price:v.price,
sku:v.sku,
existingImage: typeof v.preview === "string" && !v.image ? v.preview : ""
}));

formData.append("variants",JSON.stringify(variantsMeta));

form.variants.forEach((v,index)=>{
if(v.image){
formData.append(`variant_images_${index}`,v.image);
}
});

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
resetForm();
loadProducts();
}

}
catch(error){
console.log(error);
}
};

// ==============================
// LOAD PRODUCT FOR EDIT
// ==============================

const editProduct=(p)=>{
setEditId(p.id);

const formattedVariants=p.variants && p.variants.length
? p.variants.map(v=>({
color:v.color || "",
price:v.price || "",
sku:v.sku || "",
image:null,
preview:v.image || v.image_url || ""
}))
: [
{
color:"",
price:"",
sku:"",
image:null,
preview:""
}
];

setForm({
category_id:p.category_id || "",
brand_id:p.brand_id || "",
product_name:p.product_name || "",
description:p.description || "",
variants:formattedVariants
});

window.scrollTo({
top:0,
behavior:"smooth"
});
};

// ==============================
// UPDATE PRODUCT
// ==============================

const updateProduct=async()=>{
try{
const formData=new FormData();

formData.append("category_id",form.category_id);
formData.append("brand_id",form.brand_id);
formData.append("product_name",form.product_name);
formData.append("description",form.description);

const variantsMeta=form.variants.map(v=>({
color:v.color,
price:v.price,
sku:v.sku,
existingImage: typeof v.preview === "string" && !v.image ? v.preview : ""
}));

formData.append("variants",JSON.stringify(variantsMeta));

form.variants.forEach((v,index)=>{
if(v.image){
formData.append(`variant_images_${index}`,v.image);
}
});

const res=await fetch(
`https://visiontrackdatabase.onrender.com/products/update/${editId}`,
{
method:"PUT",
body:formData
}
);

const data=await res.json();

if(data.success){
alert("Product Updated");
resetForm();
loadProducts();
}

}
catch(error){
console.log(error);
}
};

const resetForm=()=>{
setEditId(null);
setForm({
category_id:"",
brand_id:"",
product_name:"",
description:"",
variants:[
{
color:"",
price:"",
sku:"",
image:null,
preview:""
}
]
});
};

return(
<div style={styles.container}>

<div style={styles.header}>
<h2>Master Product Management</h2>
<p>Manage optical products, variant-specific images, colours and inventory</p>
</div>

<div style={styles.card}>
<h3 style={styles.cardTitle}>
{editId ? "Edit Product" : "Add New Product"}
</h3>

<div
style={{
...styles.formGrid,
gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(250px,1fr))"
}}
>

<select
style={styles.input}
name="category_id"
value={form.category_id}
onChange={handleChange}
>
<option value="">Select Category</option>
{categories.map(c=>(
<option key={c.id} value={c.id}>{c.name}</option>
))}
</select>

<select
style={styles.input}
name="brand_id"
value={form.brand_id}
onChange={handleChange}
>
<option value="">Select Brand</option>
{brands.map(b=>(
<option key={b.id} value={b.id}>{b.name}</option>
))}
</select>

<input
style={styles.input}
name="product_name"
placeholder="Product Name"
value={form.product_name}
onChange={handleChange}
/>

</div>

<h4 style={{marginTop:"20px"}}>Colours, Images & Price Variants</h4>

{
form.variants.map((v,index)=>(
<div
key={index}
style={{
...styles.variantCard,
gridTemplateColumns: mobile ? "1fr" : "1.2fr 1fr 1fr 1fr auto"
}}
>
<label style={styles.variantUploadBox}>
{
v.preview ?
<img src={v.preview} style={styles.preview} alt="Variant Preview" />
:
<span>Upload Variant Image</span>
}
<input
type="file"
accept="image/*"
onChange={(e)=>handleVariantImage(index,e)}
style={styles.fileInput}
/>
</label>

<input
style={styles.input}
placeholder="Colour"
value={v.color}
onChange={(e)=>updateVariant(index,"color",e.target.value)}
/>

<input
style={styles.input}
placeholder="Price ₹"
value={v.price}
onChange={(e)=>updateVariant(index,"price",e.target.value)}
/>

<input
style={styles.input}
placeholder="SKU"
value={v.sku}
onChange={(e)=>updateVariant(index,"sku",e.target.value)}
/>

{form.variants.length > 1 && (
<button
onClick={()=>removeVariant(index)}
style={styles.removeBtn}
>
Remove
</button>
)}
</div>
))
}

<button
onClick={addVariant}
style={styles.addVariant}
>
+ Add Colour Variant
</button>

<textarea
style={styles.textarea}
name="description"
placeholder="Product Description"
value={form.description}
onChange={handleChange}
/>

<button
style={styles.button}
onClick={editId ? updateProduct : saveProduct}
>
{editId ? "Update Product" : "+ Add Product"}
</button>

{editId &&
<button
style={styles.cancelBtn}
onClick={resetForm}
>
Cancel Edit
</button>
}

</div>

<h3 style={styles.heading}>Products</h3>

<div
style={{
...styles.grid,
gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit,minmax(280px,1fr))"
}}
>
{
products.map(p=>(
<div key={p.id} style={styles.productCard}>
<h3>{p.product_name}</h3>
<button style={styles.editBtn} onClick={()=>editProduct(p)}>Edit</button>
<p style={styles.brand}>{p.brand}</p>
<p>Category : <b> {p.category}</b></p>

<h4>Available Variants</h4>

{
p.variants &&
p.variants.map((v,i)=>(
<div key={i} style={styles.variantBox}>
{(v.image || v.image_url) && (
<img src={v.image || v.image_url} style={styles.variantThumb} alt={v.color} />
)}
<div
style={{
width:"20px",
height:"20px",
borderRadius:"50%",
background:v.color,
border:"1px solid #ccc",
flexShrink:0
}}
/>
<div style={{textAlign:"left"}}>
<b>{v.color}</b>
<p style={styles.price}>₹{v.price}</p>
<p style={styles.sku}>SKU : {v.sku}</p>
</div>
</div>
))
}
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
variantCard:{
display:"grid",
gap:"10px",
alignItems:"center",
background:"#F8FAFC",
padding:"12px",
borderRadius:"12px",
marginBottom:"10px",
border:"1px solid #E2E8F0"
},
variantUploadBox:{
height:"80px",
border:"2px dashed #2563EB",
borderRadius:"10px",
display:"flex",
alignItems:"center",
justifyContent:"center",
color:"#2563EB",
position:"relative",
overflow:"hidden",
cursor:"pointer",
background:"#fff",
fontSize:"12px",
textAlign:"center"
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
cursor:"pointer"
},
addVariant:{
marginTop:"10px",
background:"#16A34A",
color:"#fff",
padding:"10px 20px",
border:"none",
borderRadius:"10px",
cursor:"pointer",
fontWeight:"600"
},
removeBtn:{
background:"#DC2626",
color:"#fff",
border:"none",
padding:"10px 15px",
borderRadius:"8px",
cursor:"pointer",
height:"45px"
},
heading:{
color:"#1E3A8A",
marginTop:"30px",
marginBottom:"15px"
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
brand:{
color:"#2563EB",
fontWeight:"700"
},
price:{
color:"#16A34A",
fontWeight:"700",
margin:"2px 0"
},
sku:{
color:"#64748B",
fontSize:"13px",
margin:0
},
variantBox:{
display:"flex",
alignItems:"center",
gap:"12px",
width:"100%",
background:"#F8FAFC",
padding:"10px",
borderRadius:"12px",
marginTop:"8px",
boxSizing:"border-box"
},
variantThumb:{
width:"45px",
height:"45px",
objectFit:"contain",
borderRadius:"6px",
border:"1px solid #ddd",
flexShrink:0
},
editBtn:{
background:"#F59E0B",
color:"#fff",
border:"none",
padding:"8px 20px",
borderRadius:"10px",
cursor:"pointer",
fontWeight:"700",
marginBottom:"10px"
},
cancelBtn:{
marginTop:"10px",
background:"#64748B",
color:"#fff",
padding:"12px",
border:"none",
borderRadius:"10px",
width:"100%",
cursor:"pointer",
fontWeight:"700"
}
};

export default MasterProducts;