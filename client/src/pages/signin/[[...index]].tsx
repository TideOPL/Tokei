import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function Page() {
  return (
    <div className="flex min-h-screen min-w-full justify-center items-center dark:bg-[#1a1b1e]">
      <Head>
          <title>Tokei - Sign in</title>
          <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
      </Head>
      <SignIn
        appearance={{
          elements: {
            card: 'bg-[#fefefe] dark:bg-[#282c34] font-noto-sans',
            headerTitle: 'text-black dark:text-white',
            headerSubtitle: 'text-black dark:text-white',
            socialButtonsBlockButton: 'dark:border-white',
            socialButtonsBlockButtonArrow: 'dark:text-white',
            socialButtonsBlockButtonText: 'text-black dark:text-white p-0.5',
            dividerLine: 'dark:bg-white',
            dividerText: 'text-black dark:text-white',
            formFieldInput: 'dark:bg-[#393d45]/80 focus:outline-none dark:caret-white focus:border-2 focus:border-white dark:text-white',
            formFieldLabel: 'text-black dark:text-white',
            formButtonPrimary: 'bg-dark-primary-pink hover:bg-dark-primary-pink/80 text-sm normal-case',
            footerAction: 'flex w-full items-center justify-center',
            footerActionText: 'text-black dark:text-white',
            footerActionLink: 'text-secondary hover:text-secondary/80',
            formFieldAction: 'text-secondary',
            identityPreview: 'text-black dark:text-white border-black dark:border-white',
            identityPreviewText: 'text-black dark:text-white',
            identityPreviewEditButton: 'text-primary_lighter dark:text-primary',
            alternativeMethodsBlockButton: 'text-black dark:text-white border-black dark:border-white',
            headerBackLink: 'text-secondary hover:text-secondary',
            headerBackIcon: 'text-secondary'
          }
        }}
      />
    </div>

  );
}