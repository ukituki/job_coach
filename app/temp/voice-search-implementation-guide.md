# Implementing Voice Search with VAPI in a Next.js Application

This guide provides a step-by-step approach to implementing voice search functionality using VAPI in a Next.js application. This feature allows users to initiate voice searches and interact with an AI assistant.

## Prerequisites

- Next.js project set up
- VAPI account and API keys
- Basic understanding of React hooks and TypeScript

## Step 1: Install Dependencies

Install the necessary dependencies:

```bash
npm install @vapi/vapi-js
```


## Step 2: Set Up Environment Variables

Create or update your `.env.local` file with the following variables:

```bash

NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id

```

## Step 3: Create a Custom Hook for VAPI Integration

Create a new file called `use-vapi.ts` in your `hooks` folder:

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";
export const useVapi = () => {
const [volumeLevel, setVolumeLevel] = useState(0);
const [isSessionActive, setIsSessionActive] = useState(false);
const [isMuted, setIsMuted] = useState(false);
const [conversation, setConversation] = useState<
{ role: string; text: string; timestamp: string; isFinal: boolean }[]
>([]);
const vapiRef = useRef<any>(null);
const initializeVapi = useCallback(() => {
if (!vapiRef.current) {
try {
const vapiInstance = new Vapi(publicKey);
vapiRef.current = vapiInstance;
vapiInstance.on('call-start', () => {
setIsSessionActive(true);
});
vapiInstance.on('call-end', () => {
setIsSessionActive(false);
setConversation([]);
});
vapiInstance.on('volume-level', (volume: number) => {
setVolumeLevel(volume);
});
vapiInstance.on('message', (message: any) => {
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
}
});
vapiInstance.on('error', (e: Error) => {
console.error('VAPI error:', e);
});
} catch (error) {
console.error("Error initializing VAPI:", error);
}
}
}, []);
useEffect(() => {
initializeVapi();
return () => {
if (vapiRef.current) {
vapiRef.current.stop();
vapiRef.current = null;
}
};
}, [initializeVapi]);
const toggleCall = async () => {
try {
if (isSessionActive) {
await vapiRef.current.stop();
} else {
await vapiRef.current.start(assistantId);
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
const toggleMute = () => {
if (vapiRef.current) {
const newMuteState = !isMuted;
vapiRef.current.setMuted(newMuteState);
setIsMuted(newMuteState);
}
};
return { volumeLevel, isSessionActive, conversation, toggleCall, sendMessage, toggleMute, isMuted };
};

```

## Step 4: Implement the Voice Search Component

Create a new component for the voice search functionality:

```typescript
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic } from 'lucide-react';
import { useVapi } from '@/hooks/use-vapi';
export function VoiceSearch() {
const { isSessionActive, toggleCall, conversation } = useVapi();
const handleMicClick = async () => {
console.log('Mic button clicked');
try {
await toggleCall();
console.log('VAPI call toggled, new state:', isSessionActive ? 'active' : 'inactive');
} catch (error) {
console.error('Error toggling VAPI call:', error);
}
};
return (
<div>
<Button
className="mb-8"
size="lg"
onClick={handleMicClick}
variant={isSessionActive ? "destructive" : "default"}
>
<Mic className="h-5 w-5 mr-2" />
{isSessionActive ? "Stop Voice Search" : "Start Voice Search"}
</Button>
{isSessionActive && (
<Card className="w-full max-w-2xl mb-8">
<CardContent>
<h3 className="text-lg font-semibold mb-2">Conversation</h3>
<ul className="list-disc pl-5">
{conversation.map((msg, index) => (
<li key={index} className={mb-2 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}}>
<strong>{msg.role}:</strong> {msg.text}
</li>
))}
</ul>
</CardContent>
</Card>
)}
</div>
);
}

```

## Step 5: Integrate the Voice Search Component

Integrate the `VoiceSearch` component into your main page or wherever you want the voice search functionality:

```typescript
import { VoiceSearch } from '@/components/VoiceSearch';
export function HomePage() {
return (
<div>
{/ Other components /}
<VoiceSearch />
{/ Other components /}
</div>
);
}
```

## Step 6: Handle Backend Integration (Optional)

If you need to process the voice search results on the backend:

1. Create an API route in your Next.js application.
2. In the `useVapi` hook, add logic to send the transcribed text to your backend.
3. Process the search query on the backend and return results.
4. Update the UI with the search results.

## Step 7: Styling and UI Enhancements

Customize the appearance of the voice search component to match your application's design:

- Use Tailwind CSS classes or your preferred styling method.
- Add animations for the microphone button when active.
- Implement a visual indicator for the volume level.

## Step 8: Error Handling and User Feedback

Implement proper error handling and user feedback:

- Display error messages if VAPI initialization fails.
- Show loading states while waiting for voice recognition results.
- Provide clear instructions to users on how to use the voice search feature.

## Step 9: Accessibility Considerations

Ensure the voice search feature is accessible:

- Add proper ARIA labels to the microphone button.
- Provide keyboard navigation support.
- Ensure color contrast ratios meet accessibility standards.

## Step 10: Testing

Thoroughly test the voice search functionality:

- Test in different browsers and devices.
- Verify that the feature works with different accents and languages (if supported).
- Ensure the application gracefully handles network issues or API failures.

## Conclusion

By following these steps, you can implement a voice search feature using VAPI in your Next.js application. Remember to review VAPI's documentation for any updates or additional features that may enhance your imp