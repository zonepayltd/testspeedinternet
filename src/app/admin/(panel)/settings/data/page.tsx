import SettingsView from "@/components/admin/settings/SettingsView";

export const metadata = { title: "Data & privacy · Admin" };

export default function AdminDataPage() {
  return <SettingsView initialTab="data" />;
}
