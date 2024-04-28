import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { supabase } from "../supabaseClient.js"
import LoadingPage from './loading.js';
import Navbar from './Navbar.js';
import { Footer } from './Footer.js';

export const CreateExam = () => {
    const history = useHistory();
    const [userDetails, setUser] = useState(null)
    const [examLink, setExamLink] = useState("")
    const [timeGiven, setTimeGiven] = useState(0)
    const [examName, setExamName] = useState("")

    async function getUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
            }
            else {
                history.push("/login");
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

    async function createExam(e) {
        e.preventDefault()
        try{
            const { data, error } = await supabase
            .from('exam-details')
            .insert([
                { 
                    form_link: examLink, 
                    time: timeGiven,
                    user: userDetails?.user_metadata?.email,
                    exam_name: examName
                },
            ])
            .select()

        if(data){
            history.replace("/exams")
        }
        else{
            console.log(error);
            alert("error occurred")
        }
        }
        catch (e){
            console.log(e);
            alert("error occurred")
        }

    }

    return (
        <>
        <div className='min-h-screen bg-gradient-to-r from-cyan-100 via-purple-100 to-blue-100'>
            <Navbar />
            {
                userDetails ?
                    <section className="dark:bg-gray-900">
                        <div className="flex flex-col items-center justify-center px-6 py-8 mb-20">
                            <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                                <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                                ExamProc
                            </div>
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Create a New Exam
                                    </h1>
                                    <form className="space-y-4 md:space-y-6" onSubmit={createExam}>
                                        <div>
                                            <label for="examlink" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Exam Link
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    setExamLink(e.target.value)
                                                }}
                                                type="url"
                                                name="examlink"
                                                id="examlink"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="https://exam-link.com"
                                                required={true}
                                            />
                                        </div>
                                        <div>
                                            <label for="examname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Exam Name
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    setExamName(e.target.value)
                                                }}
                                                type="text"
                                                name="examname"
                                                id="examname"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Mathematics Exam"
                                                required={true}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                for="timegiven"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time Given (in Minutes)</label>
                                            <input
                                                onChange={(e) => {
                                                    setTimeGiven(e.target.value)
                                                }}
                                                type="number"
                                                name="timegiven"
                                                id="timegiven"
                                                placeholder="60"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required=""
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start">
                                                <div className="flex items-center h-5">
                                                    <input defaultChecked id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label for="remember" className="text-gray-500 dark:text-gray-300">Enable Proctoring</label>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" onSubmit={(e) => {
                                            e.preventDefault()
                                            createExam()
                                        }} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Add Exam</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <>
                        <LoadingPage />
                    </>
            }
            <Footer />
            </div>
        </>
    );
}