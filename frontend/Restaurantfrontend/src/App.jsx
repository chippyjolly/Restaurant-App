import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
// import CustomerView from "./components/CustomerView";
import RestaurantOwnerView from "./components/RestaurantOwnerView";
// import AdminView from "./components/AdminView";
// import SingleRestaurantView from "./components/SingleRestaurantView";
// import SingleItemView from "./components/SingleItemView";
import AddMenuPage from "./components/AddMenuPage";
// import EditItemPage from "./components/EditItemPage";
// import Cart from "./components/Cart";
// import Order from "./components/Order";
// import Wishlist from "./components/Wishlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/" element={<Home />} />
        <Route path="/restaurant-owner-view" element={<RestaurantOwnerView />} />
        <Route path="/add-menu" element={<AddMenuPage />} />


      
        {/* <Route path="/admin" element={<AdminView />} />
        <Route path="/restaurant-owner" element={<RestaurantOwnerView />} />
        <Route path="/customer" element={<CustomerView />} />

        <Route path="/restaurant/:id" element={<SingleRestaurantView />} />
        <Route path="/item/:id" element={<SingleItemView />} />
        <Route path="/add-menu" element={<AddMenuPage />} />
        <Route path="/edit-item/:id" element={<EditItemPage />} />

        
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/wishlist" element={<Wishlist />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
