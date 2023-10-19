
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home';
import Address from '../pages/Address';
import AddAddress from '../pages/AddAddress';
import EditAddress from '../pages/EditAddress';


const Routers = () => {
  return (
    <div className='container'>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/address" element={<Address />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/address/:addressId" element={<EditAddress />} />
      </Routes>
    </div>
  );
};

export default Routers;
