import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";

export const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversation, setConversation] = useState<
    { role: string; text: string; timestamp: string; isFinal: boolean }[]
  >([]);
  const [toolResponse, setToolResponse] = useState<any>(null);
  const vapiRef = useRef<any>(null);
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null);

  const initializeVapi = useCallback((assistantId: string) => {
    console.log("Initializing VAPI...");
    console.log("Public Key:", publicKey);
    console.log("Assistant ID:", assistantId);

    if (vapiRef.current) {
      vapiRef.current.stop();
    }

    try {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;
      setCurrentAssistantId(assistantId);

      vapiInstance.on('call-start', () => {
        console.log("VAPI call started");
        setIsSessionActive(true);
      });

      vapiInstance.on('call-end', () => {
        console.log("VAPI call ended");
        setIsSessionActive(false);
        setConversation([]);
        setToolResponse(null);
      });

      vapiInstance.on('volume-level', (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on('message', async (message: any) => {
        console.log("Received message from VAPI:", message);
        if (message.type === 'transcript') {
          setConversation(prev => [
            ...prev,
            {
              role: message.role,
              text: message.transcript,
              timestamp: new Date().toISOString(),
              isFinal: message.transcriptType === 'final'
            }
          ]);
        } else if (message.type === 'function-call' && message.functionCall.name === 'findJob') {
          console.log("Tool call detected:", message.functionCall);
          setToolResponse(message.functionCall);
          
          const { location, startDate, industry } = message.functionCall.parameters;
          console.log(location, startDate, industry);
          try {
            const response = await fetch('/api/vapi/find-job', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message }),
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log("Received jobs from server:", data);
              
              if (data.results && data.results.length > 0) {
                const jobs = JSON.parse(data.results[0].result);
                
                // Send the jobs back to VAPI
                vapiInstance.send({
                  type: 'add-message',
                  message: {
                    role: 'function',
                    content: JSON.stringify(jobs),
                  },
                });

                // Return the first job
                return jobs[0];
              }
            } else {
              console.error("Failed to fetch jobs from server");
            }
          } catch (error) {
            console.error('Error fetching jobs:', error);
          }
        }
      });

      vapiInstance.on('error', (e: Error) => {
        console.error('VAPI error:', e);
      });

      console.log("VAPI initialized successfully");
    } catch (error) {
      console.error("Error initializing VAPI:", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        console.log("Stopping VAPI on cleanup");
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  const toggleCall = async () => {
    console.log("Toggling VAPI call...");
    if (!currentAssistantId) {
      console.error("No assistant ID set. Cannot start call.");
      return;
    }
    try {
      if (isSessionActive) {
        console.log("Stopping VAPI call");
        await vapiRef.current.stop();
      } else {
        console.log("Starting VAPI call");
        await vapiRef.current.start(currentAssistantId);
      }
    } catch (err) {
      console.error('Error toggling Vapi session:', err);
    }
  };

  const sendMessage = (role: string, content: string) => {
    if (vapiRef.current) {
      vapiRef.current.send({
        type: 'add-message',
        message: { role, content },
      });
      setConversation(prev => [
        ...prev,
        { role, text: content, timestamp: new Date().toISOString(), isFinal: true }
      ]);
    }
  };

  const say = (message: string, endCallAfterSpoken = false) => {
    if (vapiRef.current) {
      vapiRef.current.say(message, endCallAfterSpoken);
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      const newMuteState = !isMuted;
      vapiRef.current.setMuted(newMuteState);
      setIsMuted(newMuteState);
    }
  };

  const findJob = async (query: string) => {
    if (vapiRef.current) {
      vapiRef.current.send({
        type: 'add-message',
        message: { role: 'user', content: `Find job: ${query}` },
      });
      // Wait for the function call response
      return new Promise((resolve) => {
        vapiRef.current.on('message', (message: any) => {
          if (message.type === 'function-call' && message.functionCall.name === 'findJob') {
            resolve(message.functionCall.parameters);
          }
        });
      });
    }
  };

  return { 
    volumeLevel, 
    isSessionActive, 
    conversation, 
    toggleCall, 
    sendMessage, 
    say, 
    toggleMute, 
    isMuted, 
    toolResponse, 
    findJob, 
    initializeVapi,
    currentAssistantId
  };
};