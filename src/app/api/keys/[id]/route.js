import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Import the apiKeys array from the parent route
let { apiKeys } = require('../route');

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
} 