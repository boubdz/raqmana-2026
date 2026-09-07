export async function GET() {
  const data = {
    applinks: {
      apps: [],
      details: []
    },
    webcredentials: {
      apps: []
    }
  };

  return Response.json(data, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
