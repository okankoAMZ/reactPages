import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import GraphicsPage from './pages/graphics';
import Home from "./pages/home"
import TablePage from './pages/table'
import PriceCalculatorPage from './pages/price'
import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
//@TODO add comments

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home /> }/>
      <Route path="/graphics" element={<GraphicsPage />}/>
      <Route path="/table" element={<TablePage />}/>
      <Route path="/price" element={<PriceCalculatorPage />}/>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
