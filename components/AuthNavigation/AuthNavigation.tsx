"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: checkSession,
  });
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthenticated === true,
  });
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
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
