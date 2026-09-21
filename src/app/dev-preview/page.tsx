import { notFound } from "next/navigation";
import { getTemplate } from "@/lib/templates";
import { SAMPLE_INVITE_DATA } from "@/lib/templates/sampleData";
import { PhoneFrame } from "@/components/PhoneFrame";

// Dev-only route: renders a template's Live component with a hardcoded
// sample InviteData, bypassing Prisma/Postgres entirely, inside an iPhone
// frame so it can be reviewed without an actual phone. Automatically
// disabled outside development.
export default function DevPreviewPage({ searchParams }: { searchParams: { template?: string } }) {
  if (process.env.NODE_ENV === "production") return notFound();

  const slug = searchParams.template || "wedding-wax-seal";
  const tpl = getTemplate(slug);
  if (!tpl) return notFound();

  const { Live } = tpl;
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-[#f1ece4]">
      <PhoneFrame>
        <Live data={SAMPLE_INVITE_DATA} />
        <div className="max-w-md mx-auto pb-20 pt-4 px-6 bg-[#fbf3ee]">
          <div className="mt-8 text-center text-xs opacity-50">[RSVP form renders here in the real page]</div>
        </div>
      </PhoneFrame>
    </div>
  );
}
