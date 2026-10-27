import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "View and manage your NoteHub profile.",
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <section className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link className={css.editProfileButton} href="/profile/edit">
            Edit profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          {user.avatar ? (
            <Image
              className={css.avatar}
              src={user.avatar}
              alt={`${user.email} avatar`}
              width={120}
              height={120}
            />
          ) : null}
        </div>
        <div className={css.profileInfo}>
          <p>Email: {user.email}</p>
          <p>Username: {user.username ?? "Not set"}</p>
        </div>
      </section>
    </main>
  );
}
