import React from 'react';
import {Input} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const InputSection = () => {
    const [pressed, setPressed] = useState(false);
    const [text, setText] = useState("");

    useGSAP(() => {
        gsap.from(".input", { delay: 1.2, y: 50, opacity: 0 });
    }, []);
    

    function handleClick() {
        setPressed(true);
        toast.info('Text has been submitted!');
        //call api to generate audio
        console.log(text); // send text to backend

        
    }

    return (
        <>
            <div className="flex w-screen flex-row gap-16 justify-center items-center mt-40 input">

                <Input type="email" label="Text" placeholder="Enter your text to be audiofied" size="lg" key="default" color="defualt"   
                 className="w-96" value={text} onChange={(e) => setText(e.target.value)}/>

                <Button color="primary" size='lg' isLoading={pressed} onPress={() => handleClick()}>
                    Submit
                </Button>
            </div>

            <div className='border border-red-700 w-fit'>
                <Toaster richColors position='bottom-right'/>
            </div>
        </>
    );
};

export default InputSection;