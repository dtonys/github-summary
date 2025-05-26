import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { summarizeReadme } from './chain';

export async function POST(request) {
  try {
    const body = await request.json();
    const { githubUrl } = body;
    const apiKey = request.headers.get('x-api-key');

    // Validate required fields
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      );
    }

    // Validate the API key
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', apiKey)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const readmeContent = await getReadmeContent(githubUrl);
    // console.log('readmeContent', readmeContent);

    const summary = await summarizeReadme(readmeContent);
    console.log('summary', summary);
    // Return the actual summary from the LLM
    return NextResponse.json({
      success: true,
      summary: {
        repository: githubUrl,
        description: summary.summary,
        cool_facts: summary.cool_facts
      }
    });

  } catch (error) {
    console.error('Error processing GitHub summarizer request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
// Example usage of getReadmeContent
// const readmeContent = await getReadmeContent('https://github.com/vercel/next.js');
// This would fetch the README content from the Next.js repository
// Returns the raw markdown content as a string

async function getReadmeContent(githubUrl) {
  try {
    // Extract owner and repo from GitHub URL
    // Supports formats like:
    // https://github.com/owner/repo
    // https://github.com/owner/repo.git
    const urlParts = githubUrl
      .replace('https://github.com/', '')
      .replace('.git', '')
      .split('/');
    
    const owner = urlParts[0];
    const repo = urlParts[1];

    // Fetch README content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3.raw'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch README');
    }

    const content = await response.text();
    return content;

  } catch (error) {
    console.error('Error fetching README:', error);
    throw error;
  }
}



