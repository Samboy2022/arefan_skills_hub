import { redirect } from "next/navigation";

export default function ProfileRedirectPage() {
  redirect("/instructor/settings?tab=profile");
}
