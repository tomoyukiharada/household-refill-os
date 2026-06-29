import { AppShell } from "@/components/app-shell/AppShell";
import { SettingsPreviewView } from "@/components/settings/SettingsPreviewView";

export default function SettingsPage() {
  return (
    <AppShell
      eyebrow="準備中"
      title="設定"
      summary="家庭、メンバー、通知の入口"
    >
      <SettingsPreviewView />
    </AppShell>
  );
}
