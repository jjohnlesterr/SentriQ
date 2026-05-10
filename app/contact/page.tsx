import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

import { Send } from "lucide-react";

import MarketingPageShell from "@/components/layout/MarketingPageShell";
import PageTitle from "@/components/marketing/PageTitle";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/john.lester.tan.2024/",
    icon: FaFacebookF,
  },
  {
    name: "GitHub",
    href: "https://github.com/jjohnlesterr",
    icon: FaGithub,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/jjohnlesterr",
    icon: FaInstagram,
  },
];

export default function ContactPage() {
  return (
    <MarketingPageShell>
      <PageTitle
        eyebrow="Contact"
        title="Get in touch"
        description="Have questions about SentriQ or want to connect about the project? Send a message or reach out through social links."
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Side */}
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <h2 className="text-2xl font-bold text-white">
            Let’s build fair digital classrooms.
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            SentriQ is designed for schools, teachers, and students who need a
            secure and focused online assessment experience.
          </p>

          <div className="mt-6 space-y-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <social.icon className="h-4 w-4 text-cyan-300" />

                {social.name}
              </a>
            ))}
          </div>
        </Card>

        {/* Right Side */}
        <Card className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Name
              </label>

              <Input placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Email
              </label>

              <Input
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Message
              </label>

              <Textarea
                placeholder="Write your message..."
                rows={6}
              />
            </div>

            <Button
              type="button"
              className="h-11 w-full"
            >
              <Send className="h-4 w-4" />

              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </MarketingPageShell>
  );
}