'use client';

import { useEffect, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getCurrentFormattedDate } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';

const RecordVoicePage = () => {
  const [title, setTitle] = useState('Record your voice note');

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const { user } = useUser();

  const generateUploadUrl = useMutation(api.notes.generateUploadUrl);
  const createNote = useMutation(api.notes.createNote);

  const router = useRouter();

  async function startRecording() {
    setIsRunning(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: any = [];

    recorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'audio/mp3' },
        body: audioBlob,
      });
      const { storageId } = await result.json();

      let noteId = await createNote({
        userId: user!.id,
        storageId,
      });

      // setAudioFileId(noteId);

      // TODO: Push to the new page with their ID
      router.push(`/recording/${noteId}`);
    };
    setMediaRecorder(recorder as any);
    recorder.start();
  }

  function stopRecording() {
    // @ts-ignore
    mediaRecorder.stop();
    setIsRunning(false);
  }

  const formattedDate = getCurrentFormattedDate();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleRecordClick = () => {
    if (title === 'Record your voice note') {
      setTitle('Recording...');
      startRecording();
    } else if (title === 'Recording...') {
      setTitle('Processing...');
      stopRecording();
    }
  };

  return (
    <div>
      <Header />
      <div className=" flex flex-col items-center justify-between">
        <h1 className="pt-[25px] text-center text-xl font-medium text-dark md:pt-[47px] md:text-4xl">
          {title}
        </h1>
        <p className="mb-20 mt-4 text-gray-400">{formattedDate}</p>
        <div className="relative mx-auto flex h-[316px] w-[316px] items-center justify-center">
          <div
            className={`recording-box absolute h-full w-full rounded-[50%] p-[12%] pt-[17%] ${
              title !== 'Record your voice note' && title !== 'Processing...'
                ? 'record-animation'
                : ''
            }`}
          >
            <div
              className="h-full w-full rounded-[50%]"
              style={{ background: 'linear-gradient(#E31C1CD6, #003EB6CC)' }}
            />
          </div>
          <div className="z-50 flex h-fit w-fit flex-col items-center justify-center">
            <h1 className="text-[60px] leading-[114.3%] tracking-[-1.5px] text-light">
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </h1>
          </div>
        </div>
        <div className="mt-10 flex w-fit items-center justify-center gap-[33px] pb-7 md:gap-[77px] ">
          <button
            onClick={handleRecordClick}
            className="mt-10 h-fit w-fit rounded-[50%] border-[2px]"
            style={{ boxShadow: '0px 0px 8px 5px rgba(0,0,0,0.3)' }}
          >
            {!isRunning ? (
              <Image
                src={'/icons/nonrecording_mic.svg'}
                alt="recording mic"
                width={148}
                height={148}
                className="h-[70px] w-[70px] md:h-[100px] md:w-[100px]"
              />
            ) : (
              <Image
                src={'/icons/recording_mic.svg'}
                alt="recording mic"
                width={148}
                height={148}
                className="h-[70px] w-[70px] animate-pulse transition md:h-[100px] md:w-[100px]"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordVoicePage;
