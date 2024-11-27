import React from 'react';
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect } from 'react';
import axios from 'axios';


const InputSection = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const audioUrl = process.env.REACT_APP_AUDIO_URL
    const [Btn1pressed, setPressed1] = useState(false);
    const [Btn2pressed, setPressed2] = useState(false);
    const [Btn3pressed, setPressed3] = useState(false);
    const [text, setText] = useState("");
    const [data, setData] = useState("hej");


    useGSAP(() => {
        gsap.from(".input", { delay: 1.2, y: 50, opacity: 0 });
    }, []);


    // Function to fetch data from the backend API
    const fetchData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/data`); // Replace with your backend API URL
            setData(JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchAudioData = async () => {
        try {
            const response = await axios.post(`${backendUrl}/data`, {
                query: text,
                file: 'hej',
            }); // Replace with your backend API URL
            setData(JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchAudioBackendData = async () => {
        try {
            const response = await axios.get(`${audioUrl}/backend`, {
                query: text,
                file: 'hej',
            }); // Replace with your backend API URL
            setData(JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    console.log("hej");



    function handleClickAudioService() {
        setPressed1(true);
        toast.info("Audio service!");
        fetchAudioData();
        //call api to generate audio
        console.log(text); // send text to audio service
        setPressed1(false);

    }

    function handleClickBackendService() {
        setPressed2(true);
        //get audio from backend
        console.log(text); // send text to backend
        fetchData();
        toast.success('Backend service!');
        setPressed2(false);

    }

    function handleClickAudioBackendService() {
        setPressed3(true);
        //get audio from backend
        console.log(text); // send text to backend
        fetchAudioBackendData();
        toast.success('Backend service!');
        setPressed3(false)
    }

    return (
        <>
            <div className="flex w-screen flex-row gap-16 justify-center items-center mt-40 input">

                <Input type="email" label="Text" placeholder="Enter your text to be audiofied" size="lg" key="default" color="defualt"
                    className="w-96" value={text} onChange={(e) => setText(e.target.value)} />

                <Button color="primary" size='lg' isLoading={Btn1pressed} onPress={() => handleClickAudioService()}>
                    Post data to backend
                </Button>

                <Button color="primary" size='lg' isLoading={Btn2pressed} onPress={() => handleClickBackendService()}>
                    Get data from backend
                </Button>

                <Button color="primary" size='lg' isLoading={Btn3pressed} onPress={() => handleClickAudioBackendService()}>
                    Get data from audio backend
                </Button>
            </div>

            <div className='border border-red-700 w-fit'>
                <Toaster richColors position='bottom-right' />
            </div>
            {data && (
                <div className="text-center text-zinc-100">
                    <p>{data}</p>
                </div>
            )}
        </>
    );
};

export default InputSection;