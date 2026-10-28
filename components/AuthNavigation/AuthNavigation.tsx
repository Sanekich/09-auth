"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading } = useAuth();
  const clearUser = useAuthStore((state) => state.clearUser);
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      router.push("/sign-in");
      router.refresh();
    },
  });

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <li className={css.navigationItem}>
        <Link className={css.navigationLink} href="/sign-in">
          Sign in
        </Link>
        <Link className={css.navigationLink} href="/sign-up">
          Sign up
        </Link>
      </li>
    );
  }

  return (
    <li className={css.navigationItem}>
      {user?.email && <span className={css.userEmail}>{user.email}</span>}
      <Link className={css.navigationLink} href="/profile">
        Profile
      </Link>
      <button
        className={css.logoutButton}
        type="button"
        disabled={isPending}
        onClick={() => mutate()}
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </li>
  );
}
