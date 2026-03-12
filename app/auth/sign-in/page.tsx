import { Suspense } from "react";
import SignInContent from "./_sign-in-content";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
