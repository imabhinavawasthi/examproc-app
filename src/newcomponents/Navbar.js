import React, { useEffect, useState } from 'react';
import './../App.css';
import { supabase } from "../supabaseClient.js"
import { LogIn, LogOut } from 'lucide-react';
import {NavLink} from "react-router-dom"


const Navbar = () => {

    const [userDetails, setUser] = useState(null)

    async function getUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
            }
        }
        catch (e) {
            console.log(e);
            alert("error occured")
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    async function logOut() {
        await supabase.auth.signOut()
        window.location.reload()
    }

    return (
        <>
            <header className="antialiased">
                <nav className="border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between items-center">
                        <div className="flex justify-start items-center">
                            <a href="/" className="flex mr-4">
                                <img src={"https://flowbite.s3.amazonaws.com/logo.svg"} className="mr-3 h-8" alt="FlowBite Logo" />
                                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">ExamProc</span>
                            </a>
                        </div>
                        {
                            userDetails?
                            <div className="bg-white border-1 px-3 py-0 rounded-2xl flex items-center justify-center lg:order-2">
                            <div>
                                <img className="mr-3 w-10 h-10 rounded-full" src={userDetails?.user_metadata?.avatar_url || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} alt="Rounded avatar" />
                            </div>
                            <div className='mt-3'>
                                <p className='font-semibold mb-0'>{userDetails?.user_metadata?.full_name}</p>
                                <p>{userDetails?.user_metadata?.email}</p>
                            </div>
                            <div className='ml-3'>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    logOut()
                                }}>
                                    <LogOut className='text-red-600' />
                                </button>
                            </div>
                        </div>
                        :
                        <NavLink to="/login">
                        <div className="bg-white border-1 pr-3 rounded-2xl flex items-center justify-center lg:order-2">
                            <div>
                                <p className='p-3 text-lg font-bold mb-0'>Login</p>
                            </div>
                            <div className=''>
                                
                                    <LogIn className='text-blue-600' />
                                
                            </div>
                        </div>
                        </NavLink>
                        }
                    </div>
                </nav>
            </header>
        </>
    );
}

export default Navbar;