import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { supabase } from "../supabaseClient.js"
import LoadingPage from "./loading.js"
import Navbar from "./Navbar.js"
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min.js';
import { ExamCard } from './examCard.js';

const ExamsPage = () => {

    const history = useHistory();

    const [userDetails, setUser] = useState(null)
    const [exams, setExams] = useState(null)

    async function getUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
            }
            else {
                history.replace("/login")
            }
        }
        catch (e) {
            console.log(e);
            alert("error occured")
        }
    }

    async function getExams() {

        try {
            let { data: examdetails, error } = await supabase
                .from('exam-details')
                .select('*')

            if (examdetails) {
                setExams(examdetails)
                console.log(examdetails);
            }
            else {
                console.log(error);
                alert("error")
            }
        }
        catch (e) {
            console.log(e);
            alert("error")
        }

    }

    useEffect(() => {
        getUser()
        getExams()
    }, [])

    return (

        <div className='min-h-screen bg-gradient-to-r from-cyan-100 via-purple-100 to-blue-100'>
            {
                userDetails ?
                    <>
                        <Navbar />
                        <div>
                            <section className="dark:bg-gray-900">
                                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                                    <div className="mx-auto max-w-screen-sm text-center">
                                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">List of All Exams</p>
                                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Select Your Exam and Start.</p>
                                    </div>
                                </div>
                            </section>
                            <div className='container grid grid-cols-2 gap-5'>
                                {
                                    exams?.map((data, index) => {
                                        return (
                                            <div
                                                key={index}>
                                                <ExamCard
                                                    examId={data?.id}
                                                    examLink={data?.form_link}
                                                    examName={data?.exam_name}
                                                    examTime={data?.time}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <LoadingPage />
                    </>
            }
        </div>
    );
}

export default ExamsPage;