"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      router.push("/notes/filter/all");
      router.refresh();
    },
  });

  return (
    <main className={css.mainContent}>
      <form
        className={css.form}
        onSubmit={(event) => {
          event.preventDefault();
          mutate({ email, password });
        }}
      >
        <h1 className={css.formTitle}>Sign in</h1>
        <label className={css.formGroup}>
          Email
          <input
            className={css.input}
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className={css.formGroup}>
          Password
          <input
            className={css.input}
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {isError && <p className={css.error}>Invalid email or password.</p>}
        <div className={css.actions}>
          <button className={css.submitButton} disabled={isPending} type="submit">
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <p>
          No account? <Link href="/sign-up">Create one</Link>
        </p>
      </form>
    </main>
  );
}
