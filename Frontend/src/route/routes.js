import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
const Login =lazy(()=>import("../login"))
const DataTabel =lazy(()=>import("../DataTabel"))
const CustomRoutes = () => {
  return (
    <Suspense>
      <Routes>
     
      <Route path="/table" element={<DataTabel/>} />
      </Routes>
    </Suspense>
  );
};
export default CustomRoutes;
























