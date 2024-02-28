import { useAuth, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Nav from "~/component/nav/Nav";

import Head from "next/head";
import Sidebar from "~/component/nav/Sidebar";
import Browse from "~/component/browse/Browse";
import Footer from "~/component/nav/Footer";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [title, setTitle] = useState("Tokei | Stream, Chat, and Vibe");

  useEffect(() => {
    setTitle("Tokei | Browse");
  }, []);

  return (
    <div className="max-h-screen-ios flex h-screen max-h-screen flex-col overflow-hidden scroll-smooth bg-light-primary-light dark:bg-back-tertiary">
      <Head>
        <title>{title}</title>
      </Head>
      {/**@ts-ignore**/}
      <Nav user={user} signOut={() => signOut()} />

      <div className="flex max-h-[calc(100%-64px)] flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex h-full max-h-full flex-grow flex-col items-center overflow-x-hidden font-noto-sans text-white ">
          <div className="mx-auto mb-20 mt-10 w-full px-4 md:w-[80%] md:max-w-5xl md:px-0">
            <h1 className=" text-4xl font-bold text-primary">
              Tokei Community Guidelines
            </h1>
            <p className="my-5">Last Modificated: 28th February 2024</p>
            <p className="my-5">Welcome to Tokei.live</p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              Guideline 1
            </h2>
            <h3 className=" my-5 text-2xl font-bold text-primary">
              Sensitive Content
            </h3>
            <h4 className=" my-5 text-xl font-bold text-primary">
              Sexual Content
            </h4>
            <p className="my-5">
              Any sexual content real or non fictional is prohibited from
              broadcasting to Tokei.
            </p>
            <p>
              Tokei strictly prohibits from broadcasting or uploading content
              which contain real or fictional nudity. This includes censoring
              nudity, such as blurring effects, pixelisation, etc. Anything
              hinting to Nudity is prohibited
            </p>
            <h4 className=" my-5 text-xl font-bold text-primary">
              Gore and Violent Content
            </h4>
            <p className="my-5"></p>
            <h3 className=" text-1xl my-5 font-bold text-primary">
              1.2 Limited License
            </h3>
            <p>
              Tokei grants you a limited, non-exclusive, non-transferable, and
              revocable license to access and use the Service for your personal,
              non-commercial use. Tokei reserves the right to terminate this
              license at any time for any reason.
            </p>
            <h3 className=" text-1xl my-5 font-bold text-primary">
              1.3 Changes to Our Services
            </h3>
            <p>
              Changes to Our Services: Tokei reserves the right to modify,
              suspend, or discontinue the Service (or any part thereof) at any
              time without prior notice.
            </p>

            <h2 className=" my-5 text-2xl font-bold text-primary">
              2. No Warranty
            </h2>

            <p>
              To the fullest extent permitted by applicable law, Tokei provides
              the Service on an "as is" and "as available" basis without
              warranties of any kind, whether express or implied, including, but
              not limited to, implied warranties of merchantability, fitness for
              a particular purpose, or non-infringement.
            </p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              3. Limited Liability
            </h2>
            <p>
              To the extent permitted by law, in no event shall Tokei, its
              affiliates, directors, officers, employees, agents, or licensors
              be liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to, loss of profits,
              data, use, goodwill, or other intangible losses, arising out of or
              in connection with your access to or use of the Service.
            </p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              4. DMCA Notice Policy
            </h2>
            <p className="my-5">
              Tokei respects the intellectual property rights of others and
              expects users of the Service to do the same. If you believe that
              your work has been copied in a way that constitutes copyright
              infringement, please provide Tokei's designated Copyright Agent
              with the following information:
            </p>
            <p className="my-5">
              A description of the copyrighted work that you claim has been
              infringed.
            </p>
            <p className="my-5">
              A description of the material that you claim is infringing and
              where it is located on the Service. Your contact information,
              including address, telephone number, and email address.
            </p>
            <p className="my-5">
              A statement by you that you have a good faith belief that the
              disputed use is not authorized by the copyright owner, its agent,
              or the law.
            </p>
            <p className="my-5">
              A statement by you, made under penalty of perjury, that the above
              information in your notice is accurate and that you are the
              copyright owner or authorized to act on the copyright owner's
              behalf.
            </p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              5. User Generated Content
            </h2>
            <h3 className=" text-1xl my-5 font-bold text-primary">
              5.1 User Generated Content
            </h3>
            <p>
              sers retain ownership of any intellectual property rights that
              they hold in the content they submit, post, or display on or
              through the Service.
            </p>
            <h3 className=" text-1xl my-5 font-bold text-primary">
              5.2 Intellectual Property of Users
            </h3>
            <p>
              Users are solely responsible for the content they submit, post, or
              display on or through the Service. By submitting, posting, or
              displaying User Generated Content on or through the Service, you
              grant Tokei a worldwide, non-exclusive, royalty-free license (with
              the right to sublicense) to use, copy, reproduce, process, adapt,
              modify, publish, transmit, display, and distribute such User
              Generated Content in any and all media or distribution methods
              (now known or later developed). This license is granted solely for
              the purpose of operating, promoting, and improving the Service.
            </p>
            <h3 className=" text-1xl my-5 font-bold text-primary">
              5.3 Federal Trade Commission
            </h3>
            <p>
              Tokei complies with Federal Trade Commission guidelines regarding
              endorsements and testimonials. Any endorsements or testimonials
              featured on the Service reflect the honest opinions, findings,
              beliefs, or experiences of the individuals providing them. They
              are not intended to represent that every user will have the same
              experience or outcome.
            </p>
            <h3 className=" text-1xl my-5 font-bold text-primary">
              5.4 Prohibited Activities
            </h3>
            <p className="my-5">
              (a) Copying, distributing, or disclosing any part of the Service
              in any medium, including by any automated or non-automated
              “scraping”; (b) Using any automated system, including “robots,”
              “spiders,” “offline readers,” etc., to access the Service in a
              manner that sends more request messages to the Company servers
              than a human can reasonably produce in the same period of time by
              using a conventional on-line web browser (except that Company
              grants the operators of public search engines revocable permission
              to use spiders to copy publicly available materials from the
              Service for the sole purpose of and solely to the extent necessary
              for creating publicly available searchable indices of the
              materials, but not caches or archives of such materials); (c)
              Transmitting spam, chain letters, or other unsolicited email; (d)
              Attempting to interfere with, compromise the system integrity or
              security or decipher any transmissions to or from the servers
              running the Service; (e) Taking any action that imposes, or may
              impose at our sole discretion an unreasonable or
              disproportionately large load on our infrastructure; (f) Uploading
              invalid data, viruses, worms, or other software agents through the
              Service; (g) Collecting or harvesting any personally identifiable
              information, including account names, from the Service; (h) Using
              the Service for any commercial solicitation purposes; (i)
              Impersonating another person or otherwise misrepresenting your
              affiliation with a person or entity, conducting fraud, hiding or
              attempting to hide your identity; (j) Interfering with the proper
              working of the Service; (k) Accessing any content on the Service
              through any technology or means other than those provided or
              authorized by the Service; (l) Bypassing the measures we may use
              to prevent or restrict access to the Service, including features
              that prevent or restrict use or copying of any content or enforce
              limitations on use of the Service or the content therein; (m)
              Reverse engineering, decompiling, disassembling, or otherwise
              attempting to discover the source code of the Service or any part
              thereof, except and only to the extent that this activity is
              expressly permitted by the law of your jurisdiction of residence;
              (n) Attempting to circumvent any content filtering techniques we
              employ, or attempting to access any service or area of the Service
              that you are not authorized to access; (o) Manipulating
              identifiers in order to disguise the origin of any User Content
              (defined below) transmitted through the Service; (p) Relaying
              email from a third party’s mail servers without the permission of
              such third party; or (q) Uploading or making available through the
              Service: nudity or other sexually suggestive content, hate speech,
              threats or direct attacks on an individual or group, abusive,
              harassing, tortious, defamatory, vulgar, obscene, libelous,
              invasive of another’s privacy, hateful racially, ethnically, or
              otherwise objectionable content, content that contains self-harm
              or excessive violence, fake or impostor profiles, illegal content
              or content in furtherance of harmful or illegal activities,
              malicious programs or code, any person’s personal information
              without their consent, and/or spam, machine-generated content, or
              unsolicited messages.
            </p>
            <p>
              You may use our platform only for lawful purposes. You may not use
              our platform: (r) In any way that breaches any applicable local,
              national, or international law or regulation and (s) In any way
              that is unlawful or fraudulent, or has any unlawful or fraudulent
              purpose or effect and (t) For the purpose of harming or attempting
              to harm minors in any way.
            </p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              6. Disputes
            </h2>
            <p>
              To the extent permitted by law, you agree to resolve any disputes
              with other users of the Service on and off the platform
              independently and without involving Tokei.
            </p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              7. Use of Devices and Internet Access
            </h2>
            <p>
              You are responsible for obtaining the necessary devices and
              internet access to use the Service. Tokei does not guarantee that
              the Service will be compatible with all devices or that it will be
              accessible at all times.
            </p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              8. Support
            </h2>
            <p>For support please contact us at support@tokei.live</p>
            <h2 className=" my-5 text-2xl font-bold text-primary">
              9. Privacy Policy
            </h2>

            <p>
              For information about how Tokei collects, uses, and discloses
              information about users, please review our Privacy Policy
              available at{" "}
              <Link
                className="text-primary hover:underline"
                href={"https://tokei.live/privacy-policy"}
              >
                {" "}
                https://tokei.live/privacy-policy
              </Link>
              .
            </p>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
