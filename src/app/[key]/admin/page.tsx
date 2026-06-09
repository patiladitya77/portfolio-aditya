import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboard from "./AdminDashboard";

interface Props {
  params: Promise<{ key: string }>;
}

export default async function AdminPage({ params }: Props) {
  const { key } = await params;

  if (key !== process.env.ADMIN_KEY) {
    notFound();
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "true") {
    redirect(`/${key}/admin/login`);
  }

  return <AdminDashboard />;
}
