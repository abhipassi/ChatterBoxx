import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import Login from "./components/login";
import SignUp from "./components/signUp";
import OtpModal from "./components/otpModal";
import Dashboard from './components/dashboard'

function App() {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element= {<Login />}/>
          <Route path="/SignUp" element= {<SignUp />}/>
          <Route path="/otpverify" element= {<OtpModal/>}/>
          <Route path="/dashboard" element= {<Dashboard/>}/>
        </Routes>
      </Router>
       {/* <ToastContainer /> */}
       <ToastContainer limit={1} /> 


    </div>
  );
}

export default App;
