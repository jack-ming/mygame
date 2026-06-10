export async function onRequestGet(context) {
  const kv = context.env.VISITS
  const count = parseInt((await kv.get('count')) || '0', 10)
  return new Response(JSON.stringify({ count }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
