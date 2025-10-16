import { useState } from 'react'
// Імпортуємо компоненти сторінок
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';

// Імпортуємо стилі
import './App.css';

function App() {
  return (
    // Зараз відображається сторінка логіну.
    // Щоб побачити сторінку реєстрації, закоментуйте LoginPage
    // і розкоментуйте RegistrationPage.
    <LoginPage />
    // <RegistrationPage /> 
  );
}

export default App;

