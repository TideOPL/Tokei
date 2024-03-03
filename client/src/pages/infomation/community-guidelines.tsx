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
            <h2 className=" my-5 text-2xl font-bold text-primary">Guideline</h2>
            <p className="my-5">
              Welcome to TOKEI. TOKEI prioritizes providing a safe and enjoyable
              streaming experience for users of all ages. To achieve this,
              explicit or adult content is strictly prohibited on the platform.
              This includes but is not limited to nudity, sexual content, and
              explicit language. Additionally, TOKEI maintains a zero-tolerance
              policy towards violence, hate speech, and discrimination. Content
              that incites or promotes harm against individuals or groups based
              on race, ethnicity, religion, gender, sexual orientation,
              disability, or any other characteristic is not permitted.
              Moreover, TOKEI respects copyright and intellectual property
              rights, requiring users to adhere to all applicable laws and
              regulations when uploading or sharing content on the platform.
              Furthermore, TOKEI understands the importance of providing diverse
              and inclusive content while ensuring it aligns with community
              standards. Therefore, content creators are encouraged to produce
              original, creative works while refraining from infringing on the
              rights of others. TOKEI implements measures to detect and remove
              copyrighted material without proper authorization, promoting fair
              use and respecting the intellectual property of content creators.
              By upholding these content guidelines, TOKEI fosters a welcoming
              environment where users can engage with a wide range of content
              while feeling safe and respected.
            </p>

            <h3 className=" my-5 text-2xl font-bold text-primary">
              Sensitive Content
            </h3>
            <h4 className=" my-5 text-xl font-bold text-primary">
              Explicit Content:
            </h4>
            <p className="my-5">
              TOKEI maintains a strict policy against explicit or adult content.
              This includes nudity, sexual content, and any material that may be
              deemed inappropriate for a broad audience. The goal is to create a
              platform that caters to users of various age groups and cultural
              backgrounds, fostering a safe and inclusive environment.
            </p>
            <p>
              Tokei strictly prohibits from broadcasting or uploading content
              which contain real or fictional nudity. This includes censoring
              nudity, such as blurring effects, pixelisation, etc.
            </p>
            <h4 className=" my-5 text-xl font-bold text-primary">
              Gore and Violent Content
            </h4>
            <p className="my-5"></p>
            <h3 className=" my-5 text-lg font-bold text-primary">
              Violence, Hate Speech, and Discrimination
            </h3>
            <p className="my-5">
              The platform prohibits the upload or streaming of content that
              promotes violence, hate speech, or discrimination based on race,
              gender, religion, or any other characteristic. This policy is
              aimed at ensuring that TOKEI remains a space where users feel
              respected and protected from offensive and harmful material.
            </p>
            <p>
              In addition to prohibiting content that promotes violence, hate
              speech, or discrimination based on various characteristics, TOKEI
              is committed to maintaining a platform that upholds high standards
              of decency and respect for its diverse user base. This extends to
              the prohibition of graphic and gratuitous displays of gore and
              violence. TOKEI recognizes the potential harm and discomfort such
              content can inflict on users, and as a result, ensures that any
              material featuring explicit gore or violence is swiftly identified
              and removed. This policy underscores TOKEI's dedication to
              fostering an inclusive and safe digital environment where users
              can engage with content without being exposed to distressing or
              offensive material. By upholding these stringent guidelines, TOKEI
              strives to cultivate a community that encourages positive
              interactions, creativity, and mutual understanding among its
              users.
            </p>
            <h3 className=" my-5 text-lg font-bold text-primary">Gore</h3>
            <p className="my-5">
              TOKEI strictly prohibit the display or streaming of any content
              that involves explicit gore or graphic violence. This includes but
              is not limited to depictions of extreme bodily harm, blood, or
              disturbing imagery. Our goal is to foster a space where users can
              enjoy content without being subjected to distressing material. We
              believe in promoting positive interactions and maintaining an
              atmosphere of respect for all users. Any content found violating
              this policy will be promptly removed, and repeat offenders may
              face account suspension or termination. By adhering to these
              guidelines, we aim to uphold a platform that prioritizes user
              well-being and ensures an enjoyable streaming experience for
              everyone.
            </p>
            <p>
              Games that may show a explicit amount of Gore. Example Blood. Are
              required to enable the mature audience option within your stream
              settings.
            </p>

            <h2 className=" my-5 text-2xl font-bold text-primary">
              Illegal Activity
            </h2>
            <h3 className=" my-5 text-lg font-bold text-primary">
              Breaking the Law
            </h3>

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
