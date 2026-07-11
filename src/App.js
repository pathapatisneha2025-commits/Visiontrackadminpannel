import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";


import OpticalAdminLayout from "./components/Layout";
import AdminLogin from "./Pages/LoginPage";
import Dashboard from "./Pages/Dashboard";
import StoreList from "./Pages/StoreManagement";
import SubscriptionApproval from "./Pages/SubscriptionApproval";
import SubscriptionPlans from "./Pages/SubscriptionPlans";
import SuperAdminPaymentHistoryScreen from "./Pages/PaymentHistory";
import SuperAdminReports from "./Pages/ReportsPage";




function App() {

  return (

    <Router>

      <Routes>


        {/* Redirect root */}

        <Route 
          path="/" 
          element={<Navigate to="/adminlogin" />} 
        />



        {/* Login */}

        <Route 
          path="/adminlogin" 
          element={<AdminLogin />} 
        />


        {/* <Route 
          path="/forgotpassword" 
          element={<AdminForgotPassword />} 
        /> */}




        {/* SUPER ADMIN ROUTES */}

        <Route 
          path="/admin" 
          element={<OpticalAdminLayout />}
        >


          {/* Dashboard */}

          <Route 
            path="dashboard" 
            element={<Dashboard />} 
          />



          {/* Store Management */}

          <Route 
            path="stores" 
            element={<StoreList/>} 
          />



          {/* User Management */}

          {/* <Route 
            path="users" 
            element={<Users />} 
          /> */}




          <Route 
            path="subscriptions" 
            element={<SubscriptionApproval/>} 
          />


<Route 
            path="subscriptionsplans" 
            element={<SubscriptionPlans/>} 
          />
          <Route 
            path="Paymenthistory" 
            element={<SuperAdminPaymentHistoryScreen/>} 
          />


          <Route 
            path="reports" 
            element={<SuperAdminReports />} 
          />



          {/* Settings */}

          {/* <Route 
            path="settings" 
            element={<Settings />} 
          /> */}



        </Route>





        {/* 404 */}

        <Route 
          path="*" 
          element={<h2>Page Not Found</h2>} 
        />



      </Routes>


    </Router>

  );

}


export default App;