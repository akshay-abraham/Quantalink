import { LocalContentSource } from '../../../tahoe/app/lib/content/local-source';

export const dynamic = 'force-static';

export async function GET() {
  return Response.json(await new LocalContentSource().load());
}
