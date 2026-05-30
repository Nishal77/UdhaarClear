import { runReminderEngine } from '@/lib/cron/reminder-engine'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const result = await runReminderEngine()
  return Response.json(result)
}
