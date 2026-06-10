export async function onRequestGet(context) {
  const kv = context.env.VISITS
  const current = parseInt((await kv.get('count')) || '0', 10)
  const next = current + 1
  await kv.put('count', next.toString())
  return new Response(JSON.stringify({ count: next }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function onRequestPost(context) {
  return onRequestGet(context)
}
