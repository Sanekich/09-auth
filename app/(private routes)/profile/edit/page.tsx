"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState("");

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
      setUsername(user.username);
    }
  }, [user]);

  const {
    mutate,
    isPending,
    isError: isMutationError,
  } = useMutation({
    mutationFn: updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(["me"], updatedUser);
      router.push("/profile");
      router.refresh();
    },
  });

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ username });
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (isError || !user) return <p>Could not load profile.</p>;

  return (
    <main className={css.mainContent}>
      <form className={css.profileCard} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Edit profile</h1>
        {user.avatar && (
          <Image
            className={css.avatar}
            src={user.avatar}
            alt={`${user.email} avatar`}
            width={120}
            height={120}
          />
        )}
        <div className={css.profileInfo}>
          <p>Email: {user.email}</p>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              className={css.input}
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
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
