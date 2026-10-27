"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api/clientApi";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isError } = useMutation({
    mutationFn: register,
    onSuccess: () => {
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
        <h1 className={css.formTitle}>Sign up</h1>
        <label className={css.formGroup}>
          Email
          <input
            className={css.input}
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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />
        </label>
        {isError && <p className={css.error}>Could not create the account.</p>}
        <div className={css.actions}>
          <button className={css.submitButton} disabled={isPending} type="submit">
            {isPending ? "Creating..." : "Create account"}
          </button>
        </div>
        <p>
          Already registered? <Link href="/sign-in">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
