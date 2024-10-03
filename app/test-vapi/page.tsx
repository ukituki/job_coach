'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVapi } from '@/hooks/use-vapi';

export default function TestVAPIPage() {
  const { isSessionActive, toggleCall, conversation, volumeLevel, toggleMute, isMuted, sendMessage } = useVapi();

  const handleStartCall = async () => {
    await toggleCall();
  };

  const handleSendDummyMessage = () => {
    if (isSessionActive) {
      sendMessage('user', 'Find me a job in Poland starting next month');
    } else {
      console.error('VAPI session is not active. Please start the call first.');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Test VAPI Integration</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>VAPI Control</CardTitle>
          <CardDescription>Start or stop the VAPI call and send test messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleStartCall} className="mr-4">
            {isSessionActive ? 'Stop VAPI Call' : 'Start VAPI Call'}
          </Button>
          <Button onClick={toggleMute} className="mr-4">
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>
          <Button onClick={handleSendDummyMessage} disabled={!isSessionActive}>
            Send Dummy Job Query
          </Button>
          <div className="mt-2">Volume Level: {volumeLevel}</div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>The conversation with VAPI will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {conversation.map((msg: { role: string; text: string }, index: number) => (
              <li key={index} className={`mb-2 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}`}>
                <strong>{msg.role}:</strong> {msg.text}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}