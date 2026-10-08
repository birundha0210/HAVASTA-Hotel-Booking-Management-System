import{useEffect,useState}from"react";
import{useLocation,useNavigate}from"react-router-dom";
import{useDispatch,useSelector}from"react-redux";
import axios from"axios";
import{Helmet}from"react-helmet-async";
import{setHotels,removeHotel}from"../redux/hotelSlice";
import logo from"../assets/logo.png";
import name from"../assets/name.png";

function Home(){
const dispatch=useDispatch();
const navigate=useNavigate();
const location=useLocation();
const hotels=useSelector(state=>state.hotels.hotels);

const[search,setSearch]=useState("");
const[minPrice,setMinPrice]=useState("");
const[maxPrice,setMaxPrice]=useState("");
const[page,setPage]=useState(1);
const[loading,setLoading]=useState(true);

const[notification,setNotification]=useState(()=>{
const data=location.state?.notification;

return{
show:Boolean(data),
type:data?.type||"success",
message:data?.message||""
};
});

const[deleteId,setDeleteId]=useState(null);

const limit=6;
const totalPages=Math.max(1,Math.ceil(hotels.length/limit));
const startIndex=(page-1)*limit;
const currentHotels=hotels.slice(startIndex,startIndex+limit);

const showNotification=(message,type="success")=>{
setNotification({
show:true,
type,
message
});
};

const closeNotification=()=>{
setNotification({
show:false,
type:"success",
message:""
});
};

useEffect(()=>{
const fetchHotels=async()=>{
try{
setLoading(true);

const response=await axios.get("http://localhost:5000/api/hotels",{
params:{
title:search||undefined,
minPrice:minPrice||undefined,
maxPrice:maxPrice||undefined,
limit:50,
offset:0
}
});

dispatch(setHotels(response.data.hotels||[]));
setPage(1);

}catch(error){
console.error(error);
showNotification("Failed to load hotels","error");
}finally{
setLoading(false);
}
};

fetchHotels();
},[search,minPrice,maxPrice,dispatch]);

const handleSearch=e=>{
setSearch(e.target.value);
setPage(1);
};

const handleMinPrice=e=>{
setMinPrice(e.target.value);
setPage(1);
};

const handleMaxPrice=e=>{
setMaxPrice(e.target.value);
setPage(1);
};

const clearFilters=()=>{
setSearch("");
setMinPrice("");
setMaxPrice("");
setPage(1);
};

const getImageUrl=image=>{
if(!image)return"";
if(image.startsWith("http"))return image;
return`http://localhost:5000${image}`;
};

const openDelete=id=>{
setDeleteId(id);
};

const closeDelete=()=>{
setDeleteId(null);
};

const handleDelete=async()=>{
if(!deleteId)return;

try{
await axios.delete(`http://localhost:5000/api/hotels/${deleteId}`);

dispatch(removeHotel(deleteId));
setDeleteId(null);

showNotification("Hotel deleted successfully","success");

const remainingHotels=hotels.length-1;
const newTotalPages=Math.max(1,Math.ceil(remainingHotels/limit));

if(page>newTotalPages){
setPage(newTotalPages);
}

}catch(error){
console.error(error);
setDeleteId(null);
showNotification("Failed to delete hotel","error");
}
};

const changePage=newPage=>{
if(newPage<1||newPage>totalPages)return;

setPage(newPage);

window.scrollTo({
top:0,
behavior:"smooth"
});
};

return(
<>
<Helmet>
<title>HAVESTA | Hotel Management</title>
<meta name="description" content="HAVESTA Hotel Management System"/>
</Helmet>

{notification.show&&(
<div className="success-modal-overlay">
<div className="success-modal">

<div className={notification.type==="error"?"success-modal-icon error":"success-modal-icon"}>
{notification.type==="error"?"!":"✓"}
</div>

<h2>{notification.type==="error"?"Error":"Success"}</h2>

<p>{notification.message}</p>

<button className="success-ok-button" onClick={closeNotification}>
OK
</button>

</div>
</div>
)}

<header className="home-header">

<div className="brand">

<img src={logo} alt="HAVESTA logo"/>

<div className="brand-text">

<img src={name} alt="HAVESTA"/>

<p>Hotel Management System</p>

</div>

</div>

<button className="add-button" onClick={()=>navigate("/add")}>
<span>+</span>
Add Hotel
</button>

</header>

<main className="home-container">

<section className="title-section">

<div>

<h1>Hotels</h1>

<p>Discover and manage your hotel collection</p>

</div>

</section>

<section className="filter-bar">

<div className="input-wrapper">

<span>⌕</span>

<input
type="text"
placeholder="Search hotel by title..."
value={search}
onChange={handleSearch}
/>

</div>

<div className="input-wrapper">

<span>₹</span>

<input
type="number"
placeholder="Min Price"
value={minPrice}
onChange={handleMinPrice}
/>

</div>

<div className="input-wrapper">

<span>₹</span>

<input
type="number"
placeholder="Max Price"
value={maxPrice}
onChange={handleMaxPrice}
/>

</div>

<button className="clear-button" onClick={clearFilters}>
Clear
</button>

</section>

{loading?(
<div className="loading">

<div className="spinner"></div>

<p>Loading hotels...</p>

</div>
):hotels.length===0?(
<div className="empty">

<h2>No Hotels Found</h2>

<p>Try changing your search or price filter.</p>

</div>
):(
<>

<section className="hotel-grid">

{currentHotels.map(hotel=>(

<article className="hotel-card" key={hotel.id}>

<div className="card-image">

{hotel.image?(
<img
src={getImageUrl(hotel.image)}
alt={hotel.title}
/>
):(
<div className="no-image">
No Image
</div>
)}

</div>

<div className="card-content">

<h2>{hotel.title}</h2>

<div className="card-price">
₹{Number(hotel.price).toLocaleString("en-IN")}
</div>

<p>
{hotel.description?.length>80
?`${hotel.description.substring(0,80)}...`
:hotel.description}
</p>

<div className="card-buttons">

<button
className="view-button"
onClick={()=>navigate(`/hotel/${hotel.id}`)}
>
View Details
</button>

<button
className="edit-button"
onClick={()=>navigate(`/edit/${hotel.id}`)}
>
Edit
</button>

<button
className="delete-button"
onClick={()=>openDelete(hotel.id)}
>
Delete
</button>

</div>

</div>

</article>

))}

</section>

<div className="pagination">

<button
className="pagination-button"
disabled={page===1}
onClick={()=>changePage(page-1)}
>
← Previous Page
</button>

{Array.from({length:totalPages},(_,index)=>{

const pageNumber=index+1;

return(
<button
key={pageNumber}
className={page===pageNumber?"page-number active":"page-number"}
onClick={()=>changePage(pageNumber)}
>
{pageNumber}
</button>
);

})}

<button
className="pagination-button"
disabled={page===totalPages}
onClick={()=>changePage(page+1)}
>
Next →
</button>

</div>

</>
)}

</main>

{deleteId&&(
<div className="modal-background">

<div className="delete-modal">

<div className="delete-warning">
!
</div>

<h2>Delete Hotel?</h2>

<p>Are you sure you want to delete this hotel?</p>

<div className="modal-buttons">

<button
className="cancel-button"
onClick={closeDelete}
>
Cancel
</button>

<button
className="confirm-delete-button"
onClick={handleDelete}
>
Delete
</button>

</div>

</div>

</div>
)}

</>
);
}

export default Home;