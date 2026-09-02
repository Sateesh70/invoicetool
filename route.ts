export async function GET() {
  const content = "google.com, pub-6682141621893299, DIRECT, f08c47fec0942fa0";
  
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}