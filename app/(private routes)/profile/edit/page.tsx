"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, updateMe } from "@/lib/api/clientApi";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? "");
      setAvatar(user.avatar ?? "");
    }
  }, [user]);

  const {
    mutate,
    isPending,
    isError: isMutationError,
  } = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["me"], updatedUser);
      router.push("/profile");
      router.refresh();
    },
  });

  if (isLoading) return <p>Loading profile...</p>;
  if (isError || !user) return <p>Could not load profile.</p>;

  return (
    <main className={css.mainContent}>
      <form
        className={css.profileCard}
        onSubmit={(event) => {
          event.preventDefault();
          mutate({ username, avatar });
        }}
      >
        <h1 className={css.formTitle}>Edit profile</h1>
        <div className={css.usernameWrapper}>
          <label htmlFor="username">Username</label>
          <input
            className={css.input}
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className={css.usernameWrapper}>
          <label htmlFor="avatar">Avatar URL</label>
          <input
            className={css.input}
            id="avatar"
            value={avatar}
            onChange={(event) => setAvatar(event.target.value)}
          />
        </div>
        {isMutationError && <p>Could not update profile.</p>}
        <div className={css.actions}>
          <button className={css.cancelButton} type="button" onClick={() => router.back()}>
            Cancel
          </button>
          <button className={css.saveButton} type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
