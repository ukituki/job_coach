import { NextRequest, NextResponse } from 'next/server';
import { jobs } from '@/db/placeholder-data';

const dummyJobs = jobs;

async function findJob({ location, startDate, industry }: { location?: string; startDate?: string; industry?: string }) {
  console.log('Searching for jobs:', { location, startDate, industry });
  // Filter jobs based on the provided parameters
  const filteredJobs = dummyJobs.filter(job => 
    (!location || job.location.toLowerCase().includes(location.toLowerCase())) &&
    (!startDate || job.startDate <= startDate) &&
    (!industry || job.industry?.toLowerCase().includes(industry.toLowerCase()))
  );
  
  // Shuffle the filtered jobs array
  const shuffled = [...filteredJobs].sort(() => 0.5 - Math.random());
  
  // If we have less than 3 results, add random jobs to make it up to 3
  while (shuffled.length < 3) {
    const randomJob = dummyJobs[Math.floor(Math.random() * dummyJobs.length)];
    if (!shuffled.some(job => job.id === randomJob.id)) {
      shuffled.push(randomJob);
    }
  }
  
  // Return exactly 3 results
  return shuffled.slice(0, 3);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received webhook body:', JSON.stringify(body, null, 2));
    
    const { message } = body;
    console.log('Extracted message:', JSON.stringify(message, null, 2));
    
    if (message.type === 'tool-calls' && message.toolCalls && message.toolCalls.length > 0) {
      const toolCall = message.toolCalls[0];
      console.log('Tool call:', JSON.stringify(toolCall, null, 2));
      
      const { id, function: functionCall } = toolCall;
      console.log('Function call:', JSON.stringify(functionCall, null, 2));
      
      if (functionCall.name === 'findJob') {
        let args;
        try {
          args = JSON.parse(functionCall.arguments);
        } catch (error) {
          console.error('Error parsing function arguments:', error);
          args = functionCall.arguments; // Use as-is if it's not JSON
        }
        console.log('Parsed arguments:', args);
        
        const jobs = await findJob(args);
        
        const response = {
          results: [
            {
              toolCallId: id,
              result: JSON.stringify(jobs)
            }
          ]
        };
        
        console.log('Sending response:', JSON.stringify(response, null, 2));
        
        return NextResponse.json(response, { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }
    }
    
    console.log('Invalid request format');
    return NextResponse.json({ message: 'Invalid request format' }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).toString() }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}