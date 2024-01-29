import { UserProfile, useAuth, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Nav from "~/component/nav/Nav";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const {signOut} = useAuth();
  
  if (!isLoaded) {
    // Loading Screen?
    return <div />
  }

  return (
    <body className="w-full sm:min-h-screen min-h-screen-ios bg-light-primary-light dark:bg-[#212224] scroll-smooth">
      <Head>
          <title>Tokei - Profile</title>
          <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport" />
      </Head>
      {/**@ts-ignore**/}
      <Nav user={user} signOut={() => signOut()}/>
      <div className="flex justify-center items-center">
      <UserProfile path="/dashboard" routing="virtual" 
          appearance={{
            elements: {
              card: 'bg-[#fefefe] dark:bg-zinc-800 font-noto-sans dark:text-white',
              headerTitle: 'text-black dark:text-white',
              headerSubtitle: 'text-black dark:text-white',
              socialButtonsBlockButton: 'dark:border-white',
              socialButtonsBlockButtonArrow: 'dark:text-white',
              socialButtonsBlockButtonText: 'text-black dark:text-white p-0.5',
              dividerLine: 'dark:bg-white',
              dividerText: 'text-black dark:text-white',
              formFieldInput: 'dark:bg-[#393d45]/80 focus:outline-none dark:caret-white focus:border-2 focus:border-white dark:text-white',
              formFieldLabel: 'text-black dark:text-white',
              formFieldSuccessText: 'dark:text-white',
              formFieldErrorText: 'dark:text-white',
              formFieldInputShowPasswordIcon: 'dark:text-white',
              formButtonPrimary: 'bg-dark-primary-pink hover:bg-dark-primary-pink/80 text-sm normal-case',
              footerAction: 'flex w-full items-center justify-center',
              footerActionText: 'text-black dark:text-white',
              footerActionLink: 'text-secondary hover:text-secondary/80',
              formFieldInfoText: 'text-black dark:text-white',
              identityPreview: 'text-black dark:text-white border-black dark:border-white',
              identityPreviewText: 'text-black dark:text-white',
              formHeaderTitle: 'text-black dark:text-white',
              formHeaderSubtitle: 'text-black dark:text-white',
              otpCodeFieldInput: 'dark:border-white/20 dark:text-white ',
              formResendCodeLink: 'text-primary_lighter dark:text-primary',
              identityPreviewEditButton: 'text-primary_lighter dark:text-primary',
              profileSectionTitleText: "text-black dark:text-white",
              profileSectionContent: "text-black dark:text-whites",
              navbarButton: "text-black dark:text-white",
              profileSectionPrimaryButton: "text-black dark:text-white dark:hover:bg-primary_lighter/25 hover:bg-primary/50",
              breadcrumbsItem: "text-black dark:text-white",
              breadcrumbsItemDivider: "text-black dark:text-white",
              avatarImageActionsUpload: "text-primary_lighter dark:text-primary",
              formButtonReset: "text-black dark:text-white hover:bg-zinc-500/50 dark:hover:hg-zinc-700/50"
            }
          }}
      />

      </div>
    </body>
  );
}