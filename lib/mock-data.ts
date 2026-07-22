import type { SettingsSection } from "@/lib/types";

export const mockSettingsSections: SettingsSection[] = [
  {
    id: "settings-auth",
    title: "認証",
    summary: "メールアドレスまたはユーザー名でログイン",
    phase: "Phase 1",
    icon: "auth"
  },
  {
    id: "settings-members",
    title: "家族メンバー",
    summary: "ownerとmemberのロール管理",
    phase: "Phase 1",
    icon: "members"
  },
  {
    id: "settings-notifications",
    title: "通知",
    summary: "補充候補と買い忘れの通知設定",
    phase: "Phase 3+",
    icon: "notifications"
  }
];
