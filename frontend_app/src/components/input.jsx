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
    const [text, setText] = useState("");
    const [data, setData] = useState("hej");
    const [audioData, setAudioData] = useState([]);


    useGSAP(() => {
        gsap.from(".input", { delay: 1.2, y: 50, opacity: 0 });
    }, []);


    // // Function to fetch data from the backend API
    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(`${backendUrl}/data`); // Replace with your backend API URL
    //         setData(JSON.stringify(response.data));
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    const fetchAudioData = async () => {
        try {
            const response = await axios.post(`${audioUrl}/send_data`, {
                query: text,
            }, {
                responseType: 'arraybuffer',
            }); // Replace with your backend API URL
            
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audio = URL.createObjectURL(audioBlob);
            // console.log(audio);


            // setData(JSON.stringify(response.data));
            setAudioData((prevList) => [...prevList, { text: text, url: audio }]);

            // Automatically play the audio once it is fetched
            // const audioElement = document.getElementById('audio-player');
            // if (audioElement) {
            //     audioElement.src = audio;
            //     audioElement.load();
            // }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const playAudio = (url) => {
        const audioElement = document.getElementById('audio-player');
        if (audioElement) {
            audioElement.src = url;
            audioElement.load();
            audioElement.play().then(() => {
                console.log('Audio is playing');
            }).catch((error) => {
                console.error('Error playing audio:', error);
            });
        }
    };

    // const fetchAudioBackendData = async () => {
    //     try {
    //         const response = await axios.get(`${audioUrl}/backend`, {
    //             query: text,
    //             file: 'hej',
    //         }); // Replace with your backend API URL
    //         setData(JSON.stringify(response.data));
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    // console.log("hej");



    function handleClickAudioService() {
        setPressed1(true);
        toast.info("Audio service!");
        fetchAudioData();
        //call api to generate audio
        console.log(text); // send text to audio service
        setPressed1(false);

    }


    return (
        <>
            <div className="flex w-screen flex-row gap-16 justify-center items-center mt-40 input">

                <Input type="email" label="Text" placeholder="Enter your text to be audiofied" size="lg" key="default" color="defualt"
                    className="w-96" value={text} onChange={(e) => setText(e.target.value)} />

                <Button color="primary" size='lg' isLoading={Btn1pressed} onPress={() => handleClickAudioService()}>
                    Post data to backend
                </Button>
                {/* {audioData && (
                <div>
                    <audio id="audio-player" src={audioData} controls />
                    <button onClick={playAudio}>Play Audio</button>
                </div>
            )} */}

            </div>

            <div className='border border-red-700 w-fit'>
                <Toaster richColors position='bottom-right' />
            </div>
            {/* {data && (
                <div className="text-center text-zinc-100">
                    <p>{data}</p>
                </div>
            )} */}


              {/* Display list of generated audios with play buttons */}
            <div className="audio-list">
                {audioData.length > 0 ? (
                    audioData.map((audio, index) => (
                        <div key={index} className="audio-item">
                        <p>{audio.text}</p>
                        <Button color="secondary" onPress={() => playAudio(audio.url)}>
                            Play Audio {index + 1}
                        </Button>
                      
                        </div>
                    ))
                ) : (
                <div>
                    <p className='text-center text-zinc-400'>No audio files generated yet</p>
                </div>
                )}
            </div>

            {/* Audio Player */}
            <audio id="audio-player" controls />
                    
        </>
    );
};

export default InputSection;