import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client to verify the user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      console.error('User is not admin');
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get form data with the file
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided');
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Cloudflare credentials
    const accountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
    const accessKeyId = Deno.env.get('CLOUDFLARE_R2_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    const bucketName = Deno.env.get('CLOUDFLARE_R2_BUCKET_NAME');
    const publicUrl = Deno.env.get('CLOUDFLARE_R2_PUBLIC_URL');

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
      console.error('Missing Cloudflare credentials');
      return new Response(
        JSON.stringify({ error: 'Cloudflare credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `photos/${timestamp}-${randomStr}.${ext}`;

    console.log('Uploading file:', filename, 'Size:', file.size, 'Type:', file.type);

    // Read file as array buffer
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);

    // Create the R2 endpoint URL
    const r2Endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
    const objectUrl = `${r2Endpoint}/${bucketName}/${filename}`;

    // Create AWS Signature V4 for R2
    const date = new Date();
    const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);
    const region = 'auto';
    const service = 's3';

    // Create canonical request
    const method = 'PUT';
    const canonicalUri = `/${bucketName}/${filename}`;
    const canonicalQueryString = '';
    
    // Calculate content hash
    const contentHash = await crypto.subtle.digest('SHA-256', fileBytes);
    const contentHashHex = Array.from(new Uint8Array(contentHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const headers: Record<string, string> = {
      'host': `${accountId}.r2.cloudflarestorage.com`,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': contentHashHex,
      'content-type': file.type,
      'content-length': file.size.toString(),
    };

    const signedHeaders = Object.keys(headers).sort().join(';');
    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map(key => `${key}:${headers[key]}\n`)
      .join('');

    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      contentHashHex
    ].join('\n');

    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    
    const canonicalRequestHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(canonicalRequest)
    );
    const canonicalRequestHashHex = Array.from(new Uint8Array(canonicalRequestHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHashHex
    ].join('\n');

    // Calculate signing key
    const getSignatureKey = async (key: string, dateStamp: string, region: string, service: string) => {
      const kDate = await hmacSha256(`AWS4${key}`, dateStamp);
      const kRegion = await hmacSha256(kDate, region);
      const kService = await hmacSha256(kRegion, service);
      const kSigning = await hmacSha256(kService, 'aws4_request');
      return kSigning;
    };

    const hmacSha256 = async (key: string | ArrayBuffer, message: string): Promise<ArrayBuffer> => {
      const keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key;
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
    };

    const signingKey = await getSignatureKey(secretAccessKey, dateStamp, region, service);
    const signatureBuffer = await hmacSha256(signingKey, stringToSign);
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    // Upload to R2
    const uploadResponse = await fetch(objectUrl, {
      method: 'PUT',
      headers: {
        ...headers,
        'Authorization': authorizationHeader,
      },
      body: fileBytes,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('R2 upload failed:', uploadResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to upload to Cloudflare R2', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct the public URL
    const imageUrl = `${publicUrl.replace(/\/$/, '')}/${filename}`;
    console.log('Upload successful, URL:', imageUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: imageUrl,
        filename: filename 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
