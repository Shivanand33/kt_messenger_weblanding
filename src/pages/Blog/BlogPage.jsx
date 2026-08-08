import { useEffect } from 'react'
import { FiSearch, FiFacebook, FiTwitter, FiLinkedin, FiMail, FiLink } from 'react-icons/fi'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Container } from '../../components/common/Container/Container'
import { Reveal } from '../../components/common/Reveal/Reveal'
import { LinkArrow } from '../../components/common/LinkArrow/LinkArrow'
import { PhoneChatMockup } from '../../components/mockups/PhoneChatMockup'
import multideviceImg from '../../assets/images/multidevice.jpg'
import privateImg from '../../assets/images/private.jpg'
import businessImg from '../../assets/images/business.jpg'
import securityImg from '../../assets/images/security.jpg'
import groupImg from '../../assets/images/group.jpg'

const featured = {
  date: 'August 4, 2026',
  title: 'Group chats, upgraded: smarter polls, @all, and side chats',
}

const posts = [
  {
    date: 'July 22, 2026',
    title: 'Feature roundup: tablet sign-in, KT in your car, and more',
    excerpt:
      'Your most important conversations no longer live on just one device. Here is everything new this month, from signing in on a tablet to catching up hands-free on the road.',
    image: multideviceImg,
  },
  {
    date: 'June 29, 2026',
    title: 'Reserve your username and keep your number private',
    excerpt:
      'Meet someone new and want to stay in touch without handing over your phone number? Usernames let you connect on KT Messengers while keeping your number to yourself.',
    image: privateImg,
  },
  {
    date: 'June 3, 2026',
    title: 'Calls on the big screen, reimagined',
    excerpt:
      'A cleaner, faster calling experience for desktop — sharper video, simpler controls, and screen sharing that just works, whether it is one friend or a full room.',
    image: businessImg,
  },
  {
    date: 'May 15, 2026',
    title: 'How end-to-end encryption keeps every chat private',
    excerpt:
      'A plain-English look at what end-to-end encryption really means, and why not even KT Messengers can read the messages you send.',
    image: securityImg,
  },
  {
    date: 'April 28, 2026',
    title: 'Building communities that actually feel welcoming',
    excerpt:
      'Tips and tools for growing a group into a thriving community — from announcement channels to smarter admin controls that keep conversations calm.',
    image: groupImg,
  },
]

const shareIcons = [FiFacebook, FiTwitter, FiLinkedin, FiMail, FiLink]

function SocialShare() {
  return (
    <div className="flex items-center gap-2">
      {shareIcons.map((Icon, index) => (
        <a
          key={index}
          href="#blog"
          aria-label="Share"
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-body transition-colors hover:border-brand/40 hover:text-brand-ink"
        >
          <Icon className="text-sm" />
        </a>
      ))}
    </div>
  )
}

export function BlogPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <MainLayout>
      <Container className="py-14 lg:py-20">
        {/* search */}
        <div className="mb-10 flex justify-end lg:mb-14">
          <label className="flex items-center gap-3 border-b-2 border-line pb-2 text-muted transition-colors focus-within:border-brand">
            <span className="text-sm font-medium">Search blog:</span>
            <input
              type="text"
              className="w-32 bg-transparent text-sm text-ink outline-none placeholder:text-muted sm:w-44"
              aria-label="Search blog"
            />
            <FiSearch />
          </label>
        </div>

        {/* title */}
        <Reveal from="up">
          <h1 className="text-center text-[2.6rem] font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
            KT Messengers Blog
          </h1>
        </Reveal>

        {/* featured article */}
        <Reveal from="up" delay={0.06} className="mt-14 lg:mt-20">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[15px] text-body">{featured.date}</span>
            <SocialShare />
          </div>
          <h2 className="mt-6 max-w-4xl text-[2rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            {featured.title}
          </h2>

          <div className="mt-10 overflow-hidden rounded-block bg-surface-2 px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
              <p className="text-center text-2xl font-bold leading-tight text-ink lg:text-left lg:text-[2rem]">
                Introducing <span className="text-brand-ink">smarter polls, @all</span> and
              </p>
              <PhoneChatMockup className="lg:w-[236px]" />
              <p className="text-center text-2xl font-bold leading-tight text-ink lg:text-right lg:text-[2rem]">
                <span className="text-brand-ink">side group chats</span> in one tap
              </p>
            </div>
          </div>
        </Reveal>

        {/* article list */}
        <div className="mt-16 space-y-12 lg:mt-20">
          {posts.map((post, index) => (
            <Reveal
              key={post.title}
              from="up"
              delay={index * 0.04}
              as="article"
              className="grid gap-6 border-t border-line pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12"
            >
              <div className="overflow-hidden rounded-media bg-surface-2 p-3">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-56 w-full rounded-[22px] object-cover lg:h-72"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-body">{post.date}</span>
                  <SocialShare />
                </div>
                <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
                  {post.title}
                </h3>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-body">{post.excerpt}</p>
                <div className="mt-6">
                  <LinkArrow>Learn more</LinkArrow>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </MainLayout>
  )
}
