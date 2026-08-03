import { Mail } from "lucide-react";
import { SiGithub, SiInstagram } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { NotebookCard } from "@/components/scrapbook/NotebookCard";
import { HandwrittenLabel } from "@/components/scrapbook/HandwrittenLabel";
import { Doodle } from "@/components/scrapbook/Doodle";
import { CONTACT } from "@/data/contact";

const LINKS = [
  { id: "email", label: "Email", href: `mailto:${CONTACT.email}`, sub: CONTACT.email, icon: Mail },
  { id: "linkedin", label: "LinkedIn", href: CONTACT.linkedin, sub: "Let's connect", icon: FaLinkedin },
  { id: "github", label: "GitHub", href: CONTACT.github, sub: "Check the code", icon: SiGithub },
  { id: "instagram", label: "Instagram", href: CONTACT.instagram, sub: "Mostly chaos", icon: SiInstagram },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-2 flex items-center gap-3">
        <h2 className="font-(family-name:--font-display) text-3xl font-bold">Get In Touch</h2>
        <Doodle name="mail1" width={26} className="text-(--color-pen-blue)" />
      </div>
      <HandwrittenLabel as="p" size="sm" className="mb-10 text-(--color-ink-faint)">
        Say hi, or tell me what&apos;s broken.
      </HandwrittenLabel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LINKS.map(({ id, label, href, sub, icon: Icon }) => (
          <NotebookCard key={id} id={`contact-${id}`} className="flex flex-col items-center gap-2 py-6 text-center">
            <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2">
              <Icon size={26} className="text-(--color-ink)" />
              <span className="font-(family-name:--font-body) text-sm font-semibold">{label}</span>
              <span className="font-(family-name:--font-mono) text-[10px] text-(--color-ink-faint)">{sub}</span>
            </a>
          </NotebookCard>
        ))}
      </div>
    </section>
  );
}
