import { AppShell } from "@/components/app-shell/AppShell";
import { SettingsPreviewView } from "@/components/settings/SettingsPreviewView";
import { requireAppSession } from "@/lib/auth/session";

export default async function SettingsPage() {
  const session = await requireAppSession();

  return (
    <AppShell
      eyebrow="準備中"
      title="設定"
      summary="家庭、メンバー、通知の入口"
    >
      <SettingsPreviewView
        account={{
          email: session.user.email,
          householdName: session.user.householdName,
          role: session.user.role
        }}
      />
    </AppShell>
  );
}
