import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getTemplate } from "@/lib/templates";
import { buildInviteData } from "@/lib/inviteData";
import { RsvpForm } from "./RsvpForm";

export default async function InvitePage({ params }: { params: { token: string } }) {
  const guest = await prisma.guest.findUnique({
    where: { token: params.token },
    include: { event: true },
  });
  if (!guest) return notFound();

  const tpl = getTemplate(guest.event.templateSlug);
  if (!tpl) return notFound();

  const data = buildInviteData(guest.event, guest, "");
  data.rsvpUrl = "#rsvp";

  const { Live } = tpl;

  return (
    <div className="bg-[#fbf3ee]">
      <Live data={data} />
      <div id="rsvp" className="max-w-md mx-auto pb-20 pt-4 px-6">
        <RsvpForm guestToken={guest.token} initialStatus={guest.rsvpStatus} />
      </div>
      <p className="text-center text-[10px] uppercase tracking-widest text-black/30 pb-8">
        Designed with isiMemo
      </p>
    </div>
  );
}
