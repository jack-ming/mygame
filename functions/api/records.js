export async function onRequestPost(context) {
  const { env, request } = context
  const db = env.DB

  let body
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const {
    family_name,
    talents,
    wealth,
    happiness,
    health,
    study,
    career,
    business,
    art,
    sport,
    social,
    network,
    grit,
    flags,
    log,
    ending_title,
    ending_text,
    composite_score,
  } = body

  if (!family_name || !ending_title || composite_score == null) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  await db
    .prepare(
      `INSERT INTO records (family_name, talents, wealth, happiness, health, study, career, business, art, sport, social, network, grit, flags, log, ending_title, ending_text, composite_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      family_name,
      JSON.stringify(talents || []),
      wealth ?? null,
      happiness ?? null,
      health ?? null,
      study ?? null,
      career ?? null,
      business ?? null,
      art ?? null,
      sport ?? null,
      social ?? null,
      network ?? null,
      grit ?? null,
      JSON.stringify(flags || {}),
      JSON.stringify(log || []),
      ending_title,
      ending_text,
      composite_score
    )
    .run()

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

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

  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 200)
  const offset = parseInt(url.searchParams.get('offset') || '0', 10)

  const { results } = await db
    .prepare('SELECT * FROM records ORDER BY id DESC LIMIT ? OFFSET ?')
    .bind(limit, offset)
    .all()

  const countResult = await db.prepare('SELECT COUNT(*) as total FROM records').first()

  return new Response(
    JSON.stringify({ records: results, total: countResult.total }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

export async function onRequestDelete(context) {
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

  const id = url.searchParams.get('id')
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  await db.prepare('DELETE FROM records WHERE id = ?').bind(id).run()

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
