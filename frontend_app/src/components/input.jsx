import React from 'react';
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect } from 'react';
import axios from 'axios';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";
// import PlayCircleIcon from '@mui/icons-material/PlayCircle';
// import { AiFillPlayCircle } from "react-icons/ai";
import PlayButtonIcon from './play_btn'; // Adjust the path to wherever your file is



const InputSection = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const audioUrl = process.env.REACT_APP_AUDIO_URL
    const [Btn1pressed, setPressed1] = useState(false);
    const [text, setText] = useState("");
    const [audioData, setAudioData] = useState([]);


    useGSAP(() => {
        gsap.from(".input", { delay: 1.2, y: 50, opacity: 0 });
    }, []);

    useEffect(() => {
        // Fetch data from the backend
        // const fetchData = async () => {
        //     try {
        //         const response = await axios.get(`${backendUrl}/audio`);
        //         setAudioData((prevList) => [...prevList, { text: text, url: audio }]);
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };
    }, []);



    const fetchAudioData = async () => {
        try {
            const response = await axios.post(`${audioUrl}/send-data`, {
                query: text,
            }, {
                responseType: 'arraybuffer',
            }); 

            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audio = URL.createObjectURL(audioBlob);
            const id = response.headers.get('X-Files-ID');


            // setData(JSON.stringify(response.data));
            setAudioData((prevList) => [...prevList, { text: text, url: audio }]);


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


    function handleClickAudioService() {
        setPressed1(true);
        toast.info("Audio service started!");
        fetchAudioData();
        //call api to generate audio
        setPressed1(false);

    }

   
      const columns = [
        {
          key: "name",
          label: "NAME",
        },
        {
          key: "play",
          label: "PLAY",
        },
      ];


    return (
        <>
            <div className="flex w-screen mt-24 flex-row gap-16 justify-center items-center input">

                <Input type="email" label="Text" placeholder="Enter your text to be audiofied" size="lg" key="default" color="defualt"
                    className="w-96" value={text} onChange={(e) => setText(e.target.value)} />

                <Button color="primary" size='lg' isLoading={Btn1pressed} onPress={() => handleClickAudioService()}>
                    Generate audio
                </Button>
           

            </div>

            <div>
                <Toaster richColors position='bottom-right' />
            </div>
        


            <div className="audio-list mt-24">
                {audioData.length > 0 ?                 
                (

                    <div className='flex flex-row justify-center items-center gap-12 '>
                        <Table className='w-64' aria-label="Audio table">

                            <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>

                            <TableBody>
                                {audioData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.text}</TableCell>
                                        <TableCell>
                                            <Button isIconOnly onClick={() => playAudio(item.url)}>
                                                <PlayButtonIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>

                        <audio id="audio-player" controls />

                    </div>

                    )
                 : (
                <div>
                </div>
                )}
            </div>
                    
        </>
    );
};

export default InputSection;