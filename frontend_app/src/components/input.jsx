import React from 'react';
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useState, useMemo } from 'react';
import { Toaster, toast } from 'sonner'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect } from 'react';
import axios from 'axios';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination} from "@nextui-org/react";
import PlayButtonIcon from './play_btn';

function toAudioURL(data) {
    const audioBlob = new Blob([data], { type: 'audio/mpeg' });
    return URL.createObjectURL(audioBlob);
}

const InputSection = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const audioUrl = process.env.REACT_APP_AUDIO_URL
    const [Btn1pressed, setPressed1] = useState(true);
    const [text, setText] = useState("");
    const [audioData, setAudioData] = useState([]);

    const [page, setPage] = useState(1);
    const rowsPerPage = 3;
    const pages = Math.ceil(audioData.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
    
        return audioData.slice(start, end);
    }, [page, audioData]);



    useGSAP(() => {
        gsap.from(".input", { delay: 1.2, y: 50, opacity: 0 });
    }, []);

    useEffect(() => {
        axios.get(`${backendUrl}/metadata`).then((response) => {
            const { files } = response.data;
            setAudioData(files.map(({ id, query, createdAt }) => ({ id, text: query, time: new Date(createdAt), url: undefined })));
        }).catch((error) => {
            toast.error('Could not fetch any previous text-to-speech files');
        }).finally(() => {
            setPressed1(false);
        })
    }, []);



    const fetchAudioData = async () => {
        try {
            const response = await axios.post(`${audioUrl}/send-data`, {
                query: text,
            }, {
                responseType: 'arraybuffer',
            }); 
            const id = response.headers.get('X-Files-ID');
            setAudioData((prevList) => [...prevList, { text: text, url: toAudioURL(response.data), id, time: new Date() }].sort((a, b) => b.time - a.time));


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const playAudio = async (id, url) => {
        if (!url) {
            try {
                const dataBuffer = (await axios.get(`${backendUrl}/audio-files/${id}`, {
                    responseType: 'blob',
                })).data;
                const idEntry = audioData.find(({id: i}) => i === id);
                if (!idEntry) {
                    throw new Error('No entry with that name');
                }
                url = URL.createObjectURL(dataBuffer);
                setAudioData((audioData) => {
                    const removedOldId = audioData.filter(({ id: i }) => i !== id);
                    return [...removedOldId, {
                        ...idEntry,
                        url,
                    }].sort((a, b) => b.time - a.time)
                })
                

            } catch(error) {
                toast.error("Cannot load the text-to-speech file.");
                return;
            }
        }
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
                        <Table className='w-fit' aria-label="Audio table" bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        }>

                            <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                            </TableHeader>

                            <TableBody items={items}>
                                {items.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className='max-w-60 break-words'>{item.text}</TableCell>
                                        <TableCell>
                                            <Button isIconOnly onClick={() => playAudio(item.id, item.url)}>
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