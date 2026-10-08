import{BrowserRouter,Routes,Route}from"react-router-dom";
import Home from"./pages/home.jsx";
import HotelForm from"./pages/homeForm.jsx";
import HotelDetails from"./pages/hotelDetails.jsx";

function App(){
return(
<BrowserRouter>
<Routes>
<Route path="/" element={<Home/>}/>
<Route path="/add" element={<HotelForm/>}/>
<Route path="/edit/:id" element={<HotelForm/>}/>
<Route path="/hotel/:id" element={<HotelDetails/>}/>
</Routes>
</BrowserRouter>
);
}

export default App;