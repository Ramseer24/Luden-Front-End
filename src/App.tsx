import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ProfilePage } from './pages/ProfilePage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { EditProfilePage } from './pages/EditProfilePage';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/resetPass" element={<ForgotPasswordPage />} />
                <Route path="/editProfile" element={<EditProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;