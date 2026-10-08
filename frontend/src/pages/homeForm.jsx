import{useEffect,useState}from"react";
import{useNavigate,useParams}from"react-router-dom";
import axios from"axios";
import{Helmet}from"react-helmet-async";
import logo from"../assets/logo.png";
import name from"../assets/name.png";

function HotelForm(){
const navigate=useNavigate();
const{id}=useParams();
const isEditMode=Boolean(id);

const[formData,setFormData]=useState({
title:"",
description:"",
latitude:"",
longitude:"",
price:""
});

const[image,setImage]=useState(null);
const[preview,setPreview]=useState("");
const[loading,setLoading]=useState(false);
const[pageLoading,setPageLoading]=useState(isEditMode);
const[errors,setErrors]=useState({});

const getImageUrl=(imagePath)=>{
if(!imagePath)return"";
if(imagePath.startsWith("http"))return imagePath;
return`https://havasta-hotel-booking-management-system.onrender.com${imagePath}`;
};

useEffect(()=>{
if(!isEditMode)return;

const loadHotel=async()=>{
try{
const response=await axios.get(`https://havasta-hotel-booking-management-system.onrender.com/api/hotels/${id}`);
const hotel=response.data.hotel;

if(!hotel){
navigate("/",{
replace:true,
state:{
notification:{
type:"error",
message:"Hotel not found"
}
}
});
return;
}

setFormData({
title:hotel.title||"",
description:hotel.description||"",
latitude:hotel.latitude||"",
longitude:hotel.longitude||"",
price:hotel.price||""
});

if(hotel.image){
setPreview(getImageUrl(hotel.image));
}

}catch(error){
console.error(error);

try{
const response=await axios.get("https://havasta-hotel-booking-management-system.onrender.com/api/hotels",{
params:{
limit:50,
offset:0
}
});

const hotels=response.data.hotels||[];
const hotel=hotels.find(item=>String(item.id)===String(id));

if(!hotel){
navigate("/",{
replace:true,
state:{
notification:{
type:"error",
message:"Hotel not found"
}
}
});
return;
}

setFormData({
title:hotel.title||"",
description:hotel.description||"",
latitude:hotel.latitude||"",
longitude:hotel.longitude||"",
price:hotel.price||""
});

if(hotel.image){
setPreview(getImageUrl(hotel.image));
}

}catch(fallbackError){
console.error(fallbackError);

navigate("/",{
replace:true,
state:{
notification:{
type:"error",
message:"Hotel not found"
}
}
});
}
}finally{
setPageLoading(false);
}
};

loadHotel();
},[id,isEditMode,navigate]);

const handleChange=(event)=>{
const{name,value}=event.target;

setFormData(previous=>({
...previous,
[name]:value
}));

setErrors(previous=>({
...previous,
[name]:""
}));
};

const handleImage=(event)=>{
const file=event.target.files[0];

if(!file)return;

if(!file.type.startsWith("image/")){
setErrors(previous=>({
...previous,
image:"Please select a valid image."
}));
return;
}

setImage(file);
setPreview(URL.createObjectURL(file));

setErrors(previous=>({
...previous,
image:""
}));
};

const validate=()=>{
const newErrors={};

if(!formData.title.trim()){
newErrors.title="Hotel title is required.";
}

if(!formData.description.trim()){
newErrors.description="Description is required.";
}

if(formData.latitude===""){
newErrors.latitude="Latitude is required.";
}else if(Number(formData.latitude)<-90||Number(formData.latitude)>90){
newErrors.latitude="Latitude must be between -90 and 90.";
}

if(formData.longitude===""){
newErrors.longitude="Longitude is required.";
}else if(Number(formData.longitude)<-180||Number(formData.longitude)>180){
newErrors.longitude="Longitude must be between -180 and 180.";
}

if(formData.price===""){
newErrors.price="Price is required.";
}

if(!isEditMode&&!image){
newErrors.image="Hotel image is required.";
}

setErrors(newErrors);

return Object.keys(newErrors).length===0;
};

const handleSubmit=async(event)=>{
event.preventDefault();

if(!validate())return;

try{
setLoading(true);

const data=new FormData();

data.append("title",formData.title.trim());
data.append("description",formData.description.trim());
data.append("latitude",formData.latitude);
data.append("longitude",formData.longitude);
data.append("price",formData.price);

if(image){
data.append("image",image);
}

if(isEditMode){
await axios.put(`https://havasta-hotel-booking-management-system.onrender.com/api/hotels/${id}`,data);

navigate("/",{
replace:true,
state:{
notification:{
type:"success",
message:"Hotel updated successfully"
}
}
});
}else{
await axios.post("https://havasta-hotel-booking-management-system.onrender.com/api/hotels",data);

navigate("/",{
replace:true,
state:{
notification:{
type:"success",
message:"Hotel added successfully"
}
}
});
}

}catch(error){
console.error(error);

setErrors({
submit:error.response?.data?.message||"Something went wrong."
});
}finally{
setLoading(false);
}
};

if(pageLoading){
return(
<div className="page-loader">
<div className="spinner"></div>
<p>Loading hotel...</p>
</div>
);
}

return(
<>
<Helmet>
<title>{isEditMode?"Edit Hotel | HAVESTA":"Add Hotel | HAVESTA"}</title>
</Helmet>

<div className="form-page">

<div className="form-background">
<img src={logo} alt="" className="background-logo"/>
<img src={name} alt="" className="background-name"/>
</div>

<div className="form-card">

<div className="form-top">

<button className="back-button" onClick={()=>navigate("/")}>
← Back
</button>

<h1>{isEditMode?"Edit Hotel":"Add New Hotel"}</h1>

<p>{isEditMode?"Update hotel information":"Add a new hotel to HAVESTA"}</p>

</div>

<form onSubmit={handleSubmit}>

<div className="form-field">

<label>
Hotel Image

</label>

<div className="upload-box">

{preview?(
<img src={preview} alt="Hotel preview" className="preview-image"/>
):(
<div className="upload-placeholder">

<p>Click to upload hotel image</p>
<small>PNG, JPG up to 5MB</small>
</div>
)}

<input
type="file"
id="image"
accept="image/*"
onChange={handleImage}
/>

<label htmlFor="image" className="upload-label">
{preview?"Change Image":"Choose Image"}
</label>

</div>

{errors.image&&(
<small className="error-text">
⚠ {errors.image}
</small>
)}

</div>

<div className="form-field">

<label htmlFor="title">
Hotel Title

</label>

<input id="title"
name="title"
type="text"
placeholder="Enter hotel name"
value={formData.title}
onChange={handleChange}
/>

{errors.title&&(
<small className="error-text">
⚠ {errors.title}
</small>
)}

</div>

<div className="form-field">

<label htmlFor="description">
Description

</label>

<textarea
id="description"
name="description"
rows="4"
placeholder="Enter hotel description"
value={formData.description}
onChange={handleChange}
></textarea>

{errors.description&&(
<small className="error-text">
⚠ {errors.description}
</small>
)}

</div>

<div className="form-row">

<div className="form-field">

<label>
Latitude

</label>

<input
name="latitude"
type="number"
step="any"
placeholder="Example: 11.0168"
value={formData.latitude}
onChange={handleChange}
/>

{errors.latitude&&(
<small className="error-text">
⚠ {errors.latitude}
</small>
)}

</div>

<div className="form-field">

<label>
Longitude

</label>

<input
name="longitude"
type="number"
step="any"
placeholder="Example: 76.9558"
value={formData.longitude}
onChange={handleChange}
/>

{errors.longitude&&(
<small className="error-text">
⚠ {errors.longitude}
</small>
)}

</div>

</div>

<div className="form-field">

<label>
Price

</label>

<input
name="price"
type="number"
min="0"
step="0.01"
placeholder="Enter price"
value={formData.price}
onChange={handleChange}
/>

{errors.price&&(
<small className="error-text">
⚠ {errors.price}
</small>
)}

</div>

{errors.submit&&(
<div className="submit-error">
⚠ {errors.submit}
</div>
)}

<div className="form-actions">

<button
type="submit"
className="submit-button"
disabled={loading}
>
{loading?"Saving...":isEditMode?" Update Hotel":"+ Add Hotel"}
</button>

<button
type="button"
className="cancel-form-button"
onClick={()=>navigate("/")}
disabled={loading}
>
Cancel
</button>

</div>

</form>

</div>

</div>
</>
);
}

export default HotelForm;