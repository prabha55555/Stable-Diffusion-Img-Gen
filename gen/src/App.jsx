import React from 'react'
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import download from './assets/download.svg';
import icon from './assets/icon.png';
import { Home, CreatePost } from './pages';


const App = () => {
    return (
        <BrowserRouter>
            <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]'>
                <Link to='/'>
                    <img src={icon} alt='logo' className='w-32 h-15   object-contain'/>
                </Link>

                <Link to='/create-post' className='font-inter font-medium bg-[#6469ff] text-white px-6 py-2 rounded-[10px]'> Create </Link> 
            </header> 
            <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
                <Routes>
                    <Route path='/' element={<Home/>} />
                    <Route path='/create-post' element={<CreatePost />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default App    