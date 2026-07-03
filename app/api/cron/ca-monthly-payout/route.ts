import { runCAMonthlyPayoutJob } from '@/lib/cron/ca-monthly-payout'

/** Runs on the 1st of each month — see vercel.json/cron config for schedule. */
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const result = await runCAMonthlyPayoutJob()
  return Response.json(result)
}
