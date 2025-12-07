import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import RestaurantOwnerView from "./components/RestaurantOwnerView";
import EditItemPage from "./components/EditItemPage";
import CustomerView from "./components/CustomerView";
import SingleRestaurantView from "./components/SingleRestaurantView";
import AddMenuPage from "./components/AddMenuPage";
import SingleItemView from "./components/SingleItemView";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Order from "./components/Order";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import PartnerViewRestaurants from "./components/PartnerViewRestaurants";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/restaurant-owner"
          element={
            <ProtectedRoute>
              <RestaurantOwnerView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-menu"
          element={
            <ProtectedRoute>
              <AddMenuPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-menu/:id"
          element={
            <ProtectedRoute>
              <EditItemPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/single-restaurant/:restaurantId"
          element={
            <ProtectedRoute>
              <SingleRestaurantView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/item/:itemId"
          element={
            <ProtectedRoute>
              <SingleItemView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/partner/restaurants"
          element={
            <ProtectedRoute>
              <PartnerViewRestaurants />
            </ProtectedRoute>
          }
        />



      </Routes>
    </BrowserRouter>
  );
}

export default App;
