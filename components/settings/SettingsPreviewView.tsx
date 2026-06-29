import { Bell, LockKeyhole, Users } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import { mockSettingsSections } from "@/lib/mock-data";

const icons = {
  auth: LockKeyhole,
  members: Users,
  notifications: Bell
};

export function SettingsPreviewView() {
  return (
    <div className="space-y-3">
      {mockSettingsSections.map((section) => {
        const Icon = icons[section.icon];

        return (
          <article
            key={section.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold leading-7 text-ink">
                    {section.title}
                  </h2>
                  <StatusPill tone="blue">{section.phase}</StatusPill>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {section.summary}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
