import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { useLanguage } from '../../context/LanguageContext'
import { useSeo } from '../../hooks/useSeo'
import { useAdminSeo } from '../../hooks/useAdminSeo'

/**
 * The KT Messenger privacy policy.
 *
 * The four values below are the only things that have to be filled in before
 * this page is published — the policy text itself is complete. Each one is
 * left blank on purpose rather than guessed: a wrong effective date or an
 * invented contact address on a legal page is worse than an omitted line, so
 * the page simply leaves out anything that is still empty.
 */
const POLICY = {
  // e.g. '12 October 2026' — shown as both the effective and last-updated date.
  effectiveDate: '',
  // A monitored mailbox for privacy requests, e.g. 'privacy@ktmessenger.com'.
  // While empty, the contact section points people at the contact form instead.
  privacyEmail: '',
  // Exact registered name and legal form of the operating entity.
  legalEntity: '',
  // Registered or business address, if one is published.
  address: '',
}

/**
 * The operating entity. Prose that names it writes `{operator}` rather than
 * the name itself, so there is one source of truth — and so the company name
 * is never machine-translated along with the sentence around it.
 */
const OPERATOR = 'Posh Enterprise Inc.'
const SITE = 'https://ktmessenger.com'

/**
 * Substitute the operator name. A name that already ends in a full stop
 * ("… Inc.") must not collect a second one from the sentence it finishes, so
 * `{operator}.` is handled before the bare placeholder.
 */
const withOperator = (text) =>
  typeof text === 'string'
    ? text
        .replaceAll('{operator}.', OPERATOR.endsWith('.') ? OPERATOR : `${OPERATOR}.`)
        .replaceAll('{operator}', OPERATOR)
    : text

/**
 * The policy, as data. `p` is a paragraph, `ul` a bullet list and `h3` a
 * sub-heading — the renderer below is the only place that knows how each one
 * looks, so the wording stays easy to read and to amend.
 */
const SECTIONS = [
  {
    id: 'introduction',
    heading: 'Introduction',
    blocks: [
      { p: 'Welcome to KT Messenger (“KT Messenger,” “we,” “our,” or “us”), operated by {operator}.' },
      { p: 'KT Messenger provides digital communication services that enable users to connect and communicate through our website and applications. Depending on the features available, these services may include private messaging, voice and video calls, group conversations, media sharing, and other communication features.' },
      { p: 'This Privacy Policy explains how we collect, use, process, store, disclose, and protect personal information when you use KT Messenger.' },
      { p: 'We are committed to handling personal information responsibly, maintaining appropriate security measures, and providing users with information about their privacy choices.' },
    ],
  },
  {
    id: 'information-we-collect',
    heading: 'Information We Collect',
    blocks: [
      { p: 'The information we process depends on how you use KT Messenger, your account settings, and the features you choose to access.' },

      { h3: '2.1 Account Information' },
      { p: 'When you register for or use KT Messenger, we may collect information such as:' },
      { ul: [
        'Mobile phone number and/or email address.',
        'Name and profile name.',
        'Profile picture and profile information.',
        'Authentication and account security information.',
        'Account settings and communication preferences.',
      ] },
      { p: 'We use this information to establish and manage accounts, authenticate users, and provide our services.' },

      { h3: '2.2 Messages and Shared Content' },
      { p: 'Depending on the features you use, KT Messenger processes communication content such as text messages, images, videos, documents, voice messages, and other shared media.' },
      { p: 'KT Messenger uses end-to-end encryption for supported communications. Under end-to-end encryption, communication content is encrypted so that it is intended to be readable only by the communicating endpoints, rather than by the service provider in transit.' },
      { p: 'The specific encryption protections, supported communication types, and treatment of backups or other stored copies depend on the implementation of each feature.' },
      { p: 'End-to-end encryption does not necessarily protect every type of information associated with an account, such as account details, connection information, or certain technical records.' },

      { h3: '2.3 Contacts and Contact Synchronization' },
      { p: 'KT Messenger supports contact synchronization to help users discover and connect with people they know.' },
      { p: 'When you enable or use contact synchronization, the application may access contact information from your device, subject to your device permissions and the functionality you use.' },
      { p: 'This may include contact names and phone numbers, where available and permitted.' },
      { p: 'Contact information may be processed to identify contacts who use KT Messenger and support contact-related functionality.' },
      { p: 'You can manage contact permissions through your device settings. Revoking permission may limit contact-related features.' },

      { h3: '2.4 Device and Technical Information' },
      { p: 'We may process technical information necessary to operate and secure our services, including:' },
      { ul: [
        'Device type, operating system, and application version.',
        'Browser type and technical configuration.',
        'IP address and connection information.',
        'Diagnostic information, crash reports, and performance logs.',
        'Login timestamps and security-related events.',
      ] },
      { p: 'This information may be used to maintain service functionality, investigate technical issues, protect accounts, and improve reliability.' },

      { h3: '2.5 Location and Device Permissions' },
      { p: 'Certain features may request access to your camera, microphone, photos, files, or location.' },
      { p: 'We process information obtained through these permissions as necessary for the feature you choose to use and subject to applicable permissions and law.' },
      { p: 'The availability of a permission does not mean that KT Messenger continuously collects the corresponding information. Actual collection depends on the feature and its implementation.' },

      { h3: '2.6 Website Usage, Analytics, and Cookies' },
      { p: 'Our website and applications may use analytics tools and similar technologies to understand how users interact with our services and to improve functionality and performance.' },
      { p: 'Depending on the tools implemented, information processed may include page visits, session information, browser and device details, approximate location, and interaction or performance data.' },
      { p: 'Our website may use cookies or similar technologies to:' },
      { ul: [
        'Maintain essential website functionality.',
        'Remember language and other preferences.',
        'Measure website traffic and performance.',
        'Understand how visitors use our pages.',
        'Diagnose technical problems.',
      ] },
      { p: 'The specific analytics providers, cookies, identifiers, collection periods, and opt-out mechanisms depend on the technologies deployed by KT Messenger.' },
      { p: 'Where required by applicable law, we will provide appropriate notices and obtain consent before using technologies that require consent.' },
    ],
  },
  {
    id: 'how-we-use-information',
    heading: 'How We Use Information',
    blocks: [
      { p: 'We may use personal information for the following purposes:' },
      { ul: [
        'Creating, maintaining, and managing user accounts.',
        'Providing messaging, calling, contact synchronization, and other requested features.',
        'Delivering messages and facilitating communication.',
        'Authenticating users and maintaining account security.',
        'Detecting spam, fraud, abuse, and unauthorized activity.',
        'Diagnosing technical errors and improving service performance.',
        'Understanding website and application usage through analytics.',
        'Responding to customer support requests.',
        'Communicating important service updates.',
        'Complying with applicable legal obligations.',
      ] },
      { p: 'We will process personal information for purposes consistent with this Privacy Policy and the legal basis applicable to the processing.' },
    ],
  },
  {
    id: 'encryption',
    heading: 'End-to-End Encryption and Communication Security',
    blocks: [
      { p: 'KT Messenger implements end-to-end encryption for supported communications.' },
      { p: 'End-to-end encryption is designed to protect communication content from being read by parties who do not possess the necessary decryption keys. Its effectiveness depends on the encryption protocol, key management, device security, and the particular communication feature.' },
      { p: 'Encryption does not eliminate every privacy or security risk. For example, a recipient may save or share content, a device may be compromised, or certain account and connection information may still be processed to provide the service.' },
      { p: 'We will not describe a communication type as end-to-end encrypted unless that protection is actually implemented for it.' },
    ],
  },
  {
    id: 'how-we-share-information',
    heading: 'How We Share Information',
    blocks: [
      { p: 'We may disclose or make personal information available in the following circumstances, as applicable.' },

      { h3: '5.1 Service Providers' },
      { p: 'We may work with service providers that support hosting, infrastructure, email delivery, analytics, security, customer support, and other operational functions.' },
      { p: 'These providers may process information needed to perform services on our behalf, subject to applicable legal and contractual requirements.' },

      { h3: '5.2 Other Users' },
      { p: 'Information you choose to share through your profile, messages, groups, or other communication features may be visible to the recipients or audiences you select.' },
      { p: 'Recipients may retain, copy, screenshot, or redistribute information they receive, subject to applicable law and the functionality of the service.' },

      { h3: '5.3 Legal Obligations and Protection' },
      { p: 'We may disclose information where required or permitted by applicable law, including to respond to valid legal requests, address security incidents, investigate suspected fraud, enforce our terms, or protect the rights and safety of users and others.' },

      { h3: '5.4 Business Transfers' },
      { p: 'If {operator} or the relevant KT Messenger business undergoes a merger, acquisition, restructuring, or transfer of assets, personal information may be transferred as part of that transaction, subject to applicable law.' },

      { h3: '5.5 Naming Specific Providers' },
      { p: 'Our actual sharing practices depend on the service providers and integrations used by KT Messenger. We will identify specific providers and explain relevant data-sharing practices where required by applicable law.' },
    ],
  },
  {
    id: 'data-retention',
    heading: 'Data Retention',
    blocks: [
      { p: 'We retain personal information for as long as reasonably necessary for the purposes described in this Privacy Policy, subject to applicable legal, security, and operational requirements.' },
      { p: 'Retention may differ between account information, communication content, contact information, diagnostic records, analytics data, and backups.' },
      { p: 'End-to-end encryption alone does not determine how long encrypted data or related metadata is retained.' },
    ],
  },
  {
    id: 'account-deletion',
    heading: 'Account Deletion and Data Removal',
    blocks: [
      { p: 'KT Messenger provides an in-app account deletion option.' },
      { p: 'Users can use the account deletion functionality available in the application to initiate a request to delete their account.' },
      { p: 'The exact steps may depend on the application version and platform. Before confirming deletion, users should review any warning or information presented by the application about its consequences.' },
      { p: 'Following an account deletion request, personal information will be handled according to the applicable deletion process and legal requirements. Some information may remain for a limited period in backups or may need to be retained where required or permitted by law.' },
      { p: 'Deleting an account does not necessarily remove copies of messages or other information that recipients have already received or retained.' },
    ],
  },
  {
    id: 'data-security',
    heading: 'Data Security',
    blocks: [
      { p: 'We use technical and organizational measures intended to protect personal information against unauthorized access, loss, misuse, alteration, and disclosure.' },
      { p: 'Our security practices may include access restrictions, authentication safeguards, encryption where implemented, monitoring, and maintenance of our systems.' },
      { p: 'The exact safeguards vary according to the information and systems involved. No method of electronic transmission or storage can be guaranteed to be completely secure.' },
      { p: 'We will take appropriate steps to address security incidents in accordance with applicable legal requirements.' },
    ],
  },
  {
    id: 'cookies-and-analytics-choices',
    heading: 'Cookies and Analytics Choices',
    blocks: [
      { p: 'You can manage cookies through your browser settings and any preference controls provided by our website.' },
      { p: 'Blocking certain cookies may affect website functionality. Browser cookie controls may not manage all analytics technologies used within a mobile application.' },
      { p: 'Where applicable, users may be able to manage analytics permissions through application settings, device settings, or controls offered by the relevant provider.' },
    ],
  },
  {
    id: 'childrens-privacy',
    heading: "Children's Privacy",
    blocks: [
      { p: "KT Messenger will handle children's personal information in accordance with the age requirements and applicable legal obligations relevant to the service." },
      { p: "We do not knowingly collect or process children's personal information in violation of applicable law." },
    ],
  },
  {
    id: 'international-data-transfers',
    heading: 'International Data Transfers',
    blocks: [
      { p: 'Depending on our hosting infrastructure and service providers, personal information may be processed or stored in countries other than the country where a user resides.' },
      { p: 'Where applicable, international transfers will be handled in accordance with relevant legal requirements.' },
    ],
  },
  {
    id: 'your-privacy-rights',
    heading: 'Your Privacy Rights',
    blocks: [
      { p: 'Depending on applicable law, you may have rights concerning your personal information, including the right to request access, correction, deletion, or other available remedies.' },
      { p: 'You may also have the right to withdraw consent where processing is based on consent, subject to applicable legal requirements.' },
      { p: 'To exercise an applicable right, contact us using the details in the Contact Us section. We may need to verify your identity before processing a request.' },
      { p: 'We will respond to privacy requests in accordance with the applicable legal requirements and procedures.' },
    ],
  },
  {
    id: 'third-party-services',
    heading: 'Third-Party Services',
    blocks: [
      { p: 'KT Messenger may contain links to third-party websites or integrate third-party services.' },
      { p: 'These third parties may process information under their own privacy policies and terms. We encourage users to review those policies before using external services.' },
      { p: 'This Privacy Policy does not automatically govern independent third-party websites or services.' },
    ],
  },
  {
    id: 'changes-to-this-policy',
    heading: 'Changes to This Privacy Policy',
    blocks: [
      { p: 'We may update this Privacy Policy to reflect changes to our services, data practices, security measures, or applicable legal requirements.' },
      { p: 'We will update the “Last Updated” date when the policy changes and provide additional notice where required by law.' },
      { p: 'We encourage users to review this page periodically.' },
    ],
  },
]

/* ------------------------------------------------------------------ parts */

function Blocks({ blocks }) {
  const { t } = useLanguage()
  return blocks.map((block, i) => {
    if (block.h3) {
      return (
        <h3 key={i} className="mt-8 mb-3 text-[17px] font-bold text-ink">
          {withOperator(t(block.h3))}
        </h3>
      )
    }
    if (block.ul) {
      return (
        <ul key={i} className="mb-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-body marker:text-brand-strong">
          {block.ul.map((item) => (
            <li key={item}>{withOperator(t(item))}</li>
          ))}
        </ul>
      )
    }
    return (
      <p key={i} className="mb-4 text-[15px] leading-7 text-body">
        {withOperator(t(block.p))}
      </p>
    )
  })
}

/* ------------------------------------------------------------------- page */

/**
 * Scroll to a section without letting the browser append "#section-id" to the
 * address bar. The ids stay on the sections, so a link someone was given
 * earlier still lands in the right place — only the click is silent.
 */
function jumpTo(event, id) {
  const target = document.getElementById(id)
  // Only take over once the section is definitely there. Calling
  // preventDefault() first would turn a missed lookup into a dead link.
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function PrivacyPolicyPage() {
  const { t } = useLanguage()

  useSeo({
    title: 'Privacy Policy | KT Messenger',
    description: 'How KT Messenger collects, uses, stores and protects personal information, and the privacy choices available to you.',
    path: '/privacy-policy',
  })
  useAdminSeo('privacy-policy', '/privacy-policy')

  return (
    <MainLayout>
      <Container className="py-14 lg:py-20">
        {/* Title block */}
        <header className="border-b border-line pb-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-strong">{t('Legal')}</p>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
            {t('KT Messenger Privacy Policy')}
          </h1>
          <dl className="mt-6 grid gap-x-10 gap-y-2 text-[14px] text-muted sm:grid-cols-2">
            {POLICY.effectiveDate ? (
              <>
                <div className="flex gap-2">
                  <dt className="font-semibold text-ink">{t('Effective date')}:</dt>
                  <dd>{POLICY.effectiveDate}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold text-ink">{t('Last updated')}:</dt>
                  <dd>{POLICY.effectiveDate}</dd>
                </div>
              </>
            ) : null}
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">{t('Operated by')}:</dt>
              <dd>{OPERATOR}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">{t('Website')}:</dt>
              <dd>
                <a href={SITE} className="text-brand-strong hover:underline">
                  {SITE}
                </a>
              </dd>
            </div>
          </dl>
        </header>

        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
          {/* Contents */}
          <nav aria-label={t('On this page')} className="hidden lg:block">
            <div className="sticky top-24 py-10">
              <p className="pb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-muted">{t('On this page')}</p>
              <ol className="space-y-2 text-[13.5px]">
                {SECTIONS.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => jumpTo(e, section.id)}
                      className="text-body transition-colors hover:text-brand-strong"
                    >
                      <span className="tabular-nums text-muted">{i + 1}.</span> {t(section.heading)}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#contact-us"
                    onClick={(e) => jumpTo(e, 'contact-us')}
                    className="text-body transition-colors hover:text-brand-strong"
                  >
                    <span className="tabular-nums text-muted">{SECTIONS.length + 1}.</span> {t('Contact Us')}
                  </a>
                </li>
              </ol>
            </div>
          </nav>

          {/* Policy */}
          <div className="max-w-[72ch] py-10">
            {SECTIONS.map((section, i) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 pb-6">
                <h2 className="mb-4 text-[21px] font-bold tracking-tight text-ink">
                  <span className="tabular-nums text-muted">{i + 1}.</span> {t(section.heading)}
                </h2>
                <Blocks blocks={section.blocks} />
              </section>
            ))}

            {/* Contact — rendered here rather than in SECTIONS because its rows
                depend on which POLICY fields have been filled in. */}
            <section id="contact-us" className="scroll-mt-24 pb-6">
              <h2 className="mb-4 text-[21px] font-bold tracking-tight text-ink">
                <span className="tabular-nums text-muted">{SECTIONS.length + 1}.</span> {t('Contact Us')}
              </h2>
              <p className="mb-4 text-[15px] leading-7 text-body">
                {t("For questions, concerns, or requests relating to this Privacy Policy or KT Messenger's handling of personal information, contact us using the details below.")}
              </p>

              <dl className="mb-4 space-y-2 rounded-2xl border border-line bg-surface p-5 text-[15px] leading-7">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-ink">{t('Service')}:</dt>
                  <dd className="text-body">KT Messenger</dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-ink">{t('Operator')}:</dt>
                  <dd className="text-body">{OPERATOR}</dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-ink">{t('Website')}:</dt>
                  <dd>
                    <a href={SITE} className="text-brand-strong hover:underline">
                      {SITE}
                    </a>
                  </dd>
                </div>
                {POLICY.privacyEmail ? (
                  <div className="flex flex-wrap gap-2">
                    <dt className="font-semibold text-ink">{t('Privacy contact')}:</dt>
                    <dd>
                      <a href={`mailto:${POLICY.privacyEmail}`} className="text-brand-strong hover:underline">
                        {POLICY.privacyEmail}
                      </a>
                    </dd>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <dt className="font-semibold text-ink">{t('Privacy contact')}:</dt>
                    <dd>
                      <a href="/contact" className="text-brand-strong hover:underline">
                        {t('Contact the KT Messenger team')}
                      </a>
                    </dd>
                  </div>
                )}
                {POLICY.legalEntity ? (
                  <div className="flex flex-wrap gap-2">
                    <dt className="font-semibold text-ink">{t('Registered legal entity')}:</dt>
                    <dd className="text-body">{POLICY.legalEntity}</dd>
                  </div>
                ) : null}
                {POLICY.address ? (
                  <div className="flex flex-wrap gap-2">
                    <dt className="font-semibold text-ink">{t('Registered address')}:</dt>
                    <dd className="text-body">{POLICY.address}</dd>
                  </div>
                ) : null}
              </dl>

              <p className="text-[15px] leading-7 text-body">
                {t('We will review privacy-related inquiries and handle requests in accordance with applicable law.')}
              </p>
            </section>
          </div>
        </div>
      </Container>
    </MainLayout>
  )
}

export default PrivacyPolicyPage
