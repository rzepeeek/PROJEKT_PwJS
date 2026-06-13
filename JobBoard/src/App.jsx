// konfiguracja routingu aplikacji (przelaczanie miedzy innymi linkami)

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import NewJob from "./pages/NewJob";
import JobDetails from "./pages/JobDetails";
import Apply from "./pages/Apply";
import EditJob from "./pages/EditJob";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
    {/* wyswietlanie paska nawigacyjnego w aplikacji */}
      <Navbar />

      <Routes>
        {/* przekierowanie z glownego adresu na strone logowania */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* publicznie dostepne strony aplikacji */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* routing zwiazany z ofertami pracy */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/new" element={<NewJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<Apply />} />
        <Route path="/jobs/:id/edit" element={<EditJob />} />

        {/* chroniony dostep do panelu uzytkownika */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
              </Routes>
            </BrowserRouter>
    
  );
}

export default App;