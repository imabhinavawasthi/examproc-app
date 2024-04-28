// importing required files
import React from 'react';
import { useState, useEffect } from 'react';
import Detection from './Detections';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import DetectRTC from 'detectrtc';
import { supabase } from "../supabaseClient.js"
import swal from 'sweetalert';
import formvalid from './formvalid';
import firebase from "firebase/app";
import "./Dashboard2.css";
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min.js';


const Dashboard = (props) => {
  const [userDetails, setUser] = useState(null)

    async function getUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
            }
            else{
              history.replace("login")
            }
            console.log(user);
        }
        catch (e) {
            console.log(e);
            alert("error occured")
        }
    }

    useEffect(() => {
        getUser()
    }, [])
  // getting the form link from session storage of browser
  var form_link = sessionStorage.getItem("form_link");

  //Disable Right click
  if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
  }

  // Alert on Tab Changed within the Same browser Window
  function handleVisibilityChange() {
    if (document.hidden) {
      var count_tabchange = 0;
      swal("Changed Tab Detected", "Action has been Recorded", "error");
      // the page is hidden
      count_tabchange = count_tabchange + 1
      sessionStorage.setItem("count_tabchange", count_tabchange);
    } else {
      // the page is visible
    }
  }
  document.addEventListener("visibilitychange", handleVisibilityChange, false);

  //To make sure the user does not open any other App or lose Focus from the test Window
  var i = 0;

  const history = useHistory();
    

    function onAccept() {
      history.push('/thankyou')
    }


  // Count number of times escaped Fullscreen

  if (document.fullscreenElement) {
    // no issues else we there should be alert given 
  } else {
    history.push('/fullscreenalert')
  }

  document.addEventListener('fullscreenchange', (event) => {
    var count_fullscreen = 0;
    if (document.fullscreenElement) {

    } else {
      history.push("/fullscreenalert")

      count_fullscreen = count_fullscreen + 1;
      sessionStorage.setItem("count_fullscreen", count_fullscreen);
    }
  });

  var countalt = 0;
  document.onkeydown = function (event) {
    if (event.altKey) {
      swal('Keypress Detected');
      countalt = countalt + 1;
      sessionStorage.setItem("countalt", countalt);
      return false;
    }
    else {
      return true;
    }
  }
  
  var countctrl = 0;
  document.onkeydown = function (event) {
      if (event.ctrlKey){
      swal('Keypress Detected');
      countctrl = countctrl + 1;
      sessionStorage.setItem("countctrl", countctrl);
      return false;
    } else {
      return true;
    }
  }

  //Displays Score in Thankyou page
  function handleClicksub() {
    var PIDs = sessionStorage.getItem("checkname").slice(-6)
    var count_facedetect = sessionStorage.getItem("count_facedetect")
    var count_fullscreen = sessionStorage.getItem("count_fullscreen")
    var count_tabchange = sessionStorage.getItem("count_tabchange")
    var countalt = sessionStorage.getItem("countalt")
    var countctrl = sessionStorage.getItem("countctrl")
    var checkn = sessionStorage.getItem("checkname")
    var checke = sessionStorage.getItem("checkemail")
    var photo = sessionStorage.getItem("imageSrc")
    //Fetching data from FireBase
    const con_db = firebase.database().ref("stud_records");
    con_db.on('value', (snapshot) => {


      var s = snapshot.val()
      var codeexam = sessionStorage.getItem("formvalid", formvalid);

      con_db.child(codeexam).child(PIDs).set({
        alt: countalt,
        tab: count_tabchange,
        face: count_facedetect,
        fullscreen: count_fullscreen,
        semail: checke,
        sname: checkn,
        photo: photo

      })
    });

    history.push('/thankyou')
  };

  
// Camera Permission
  DetectRTC.load(function () {

    const webcam = DetectRTC.isWebsiteHasWebcamPermissions;
    if (!webcam) {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      var video = document.querySelector("#videoElement");
      if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
          })

          .catch(function (err0r) {
          });
      }
    }

  });


// enable/disable iframe according to camera permissions
  const webcam = DetectRTC.isWebsiteHasWebcamPermissions;
 

    if (webcam === true) {
    var isAllowed = sessionStorage.getItem("form_link");;  
  } 
    else {
    var isAllowed = '/components/404.js';
    swal("Enable Your Camera");
  }
  
  // Fetches the timer provided by Admin in Admin page to Dashboard
  var get_time = sessionStorage.getItem("exam_timer");
  var get_sec = sessionStorage.getItem("exam_sec");
  if(get_sec === null){
    get_sec = 0;
  }
 const { initialMinute = get_time, initialSeconds = get_sec } = props;
  const myInterval = React.useRef();
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        var currectSec = seconds;
         sessionStorage.setItem("exam_sec", currectSec);
      }
      else {
         var currectTime = minutes-1;
          sessionStorage.setItem("exam_timer", currectTime);
          setMinutes(minutes - 1);
          setSeconds(59);
         
        }

        if (minutes === 1 && seconds === 0) {
          swal("Only 1 Minute Left, Please Submit or else Answers WONT BE SAVED ");
        }

      if (seconds <= 0 && minutes <= 0) {
         history.push('/thankyou');
        }
  },1000);
 
      return () => {
      clearInterval(myInterval);
    };
  });
 
  return (


    <div className="App-header" id="Dash">
      <header>

        <div className="detect">
          {/* Detection Section Starts here*/}
          <Detection>

          </Detection>
          {/*Detection Section ends here */}
        </div>

        <div className="lame">
          <h3 align="left">Name :  <span style={{ fontSize: '20px' }} > {userDetails?.user_metadata?.full_name}</span></h3>
          <h3 align="left">Email :  <span style={{ fontSize: '20px' }} > {userDetails?.user_metadata?.email}</span></h3>
        </div>

        <div className="leftClass">
          <p>Timer: {minutes === 0 && seconds === 1 ? null : <h1 align="center" style={{ fontSize: '69px' }}>  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
          } </p>
        </div>

        <div className="button">
          <p align="center" style={{ fontSize: '18px' }}>To Save Your Attendance :<br/> Kindly Click <strong>Exit Exam Window</strong> After Submission Of Google Form </p>
          <center>
            <NavLink
              style={{ fontSize: '15px' }}
              variant="contained"
              color="primary"
              size="medium"
              to="/thankyou">
              Exit Exam Window
              </NavLink>
          </center>
          {/* <br/> */}
          <p align="left" style={{ fontSize: '18px' }}><i>DONOT ESCAPE THIS PAGE ELSE ANSWERS WILL BE UNSAVED!!</i></p>
        </div>

        <iframe src={isAllowed} id='form'>Loading…</iframe >

      </header>

    </div>
  )
}

export default Dashboard;
