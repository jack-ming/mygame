export async function onRequestGet(context) {
  const { env, request } = context
  const db = env.DB
  const url = new URL(request.url)

  const token = url.searchParams.get('token')
  if (token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const totalResult = await db.prepare('SELECT COUNT(*) as total FROM records').first()

  const todayResult = await db
    .prepare("SELECT COUNT(*) as total FROM records WHERE date(created_at) = date('now')")
    .first()

  const avgResult = await db
    .prepare('SELECT AVG(composite_score) as avg_score FROM records')
    .first()

  const { results: endingDistribution } = await db
    .prepare('SELECT ending_title, COUNT(*) as count FROM records GROUP BY ending_title ORDER BY count DESC')
    .all()

  return new Response(
    JSON.stringify({
      total: totalResult.total,
      today: todayResult.total,
      avgScore: Math.round(avgResult.avg_score || 0),
      endingDistribution,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
