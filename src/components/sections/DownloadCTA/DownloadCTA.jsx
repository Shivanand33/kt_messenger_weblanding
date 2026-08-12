import { FiDownload, FiArrowUpRight, FiCheck } from 'react-icons/fi'
import { Section } from '../../common/Section/Section'
import { Button } from '../../common/Button/Button'
import { Reveal } from '../../common/Reveal/Reveal'
import { useModal } from '../../../context/ModalContext'

const points = ['No ads', 'No subscription', 'Encrypted by default']
const LOGIN_URL = 'https://web.ktmessenger.com/auth/qr'

export function DownloadCTA() {
  const { openDownloadModal } = useModal()

  return (
    <Section id="download">
      <Reveal from="up">
        <div className="relative overflow-hidden rounded-block bg-gradient-to-br from-brand-strong to-[#0b6b3f] px-7 py-14 text-white shadow-float sm:px-12 lg:px-16 lg:py-20">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-[2rem] font-extrabold tracking-tight sm:text-4xl lg:text-[2.9rem]">
              Get KT Messenger. It&apos;s free.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-white/85">
              Download KT Messenger on your phone and desktop, and bring every conversation into one calm, secure place.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Button variant="white" size="lg" onClick={openDownloadModal}>
                <FiDownload /> Download
              </Button>
              <Button variant="onDark" size="lg" href={LOGIN_URL}>
                Open KT Web <FiArrowUpRight />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
              {points.map((point) => (
                <span key={point} className="inline-flex items-center gap-2">
                  <FiCheck className="text-white" /> {point}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
