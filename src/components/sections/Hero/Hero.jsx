import { motion } from 'framer-motion'
import { FiDownload, FiVideo, FiCalendar, FiCheck } from 'react-icons/fi'
import { Container } from '../../common/Container/Container'
import { Button } from '../../common/Button/Button'
import { Reveal } from '../../common/Reveal/Reveal'
import { useModal } from '../../../context/ModalContext'
import heroImage from '../../../assets/images/hero.jpg'
import nadiaAvatar from '../../../assets/images/nadia_avatar.png'
import femaleAvatar from '../../../assets/images/avatar_female_1.png'
import privateAvatar from '../../../assets/images/private.jpg'
import businessAvatar from '../../../assets/images/business.jpg'
import groupAvatar from '../../../assets/images/group.jpg'

const stackImages = [privateAvatar, businessAvatar, groupAvatar, femaleAvatar]

const floatMotion = (offset) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 5 + offset, repeat: Infinity, ease: 'easeInOut' },
})

export function Hero() {
  const { openDownloadModal } = useModal()
  return (
    <section id="hero" className="px-3 pt-3 sm:px-4 lg:px-5">
      <div className="relative overflow-hidden rounded-[22px] lg:rounded-[30px]">
        <img
          src={heroImage}
          alt="Friends staying in touch on KT Messengers"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25 lg:via-black/40 lg:to-transparent" />

        <Container className="relative grid min-h-[532px] items-center gap-8 py-16 sm:min-h-[600px] lg:min-h-[680px] lg:grid-cols-2 lg:py-20">
          {/* copy */}
          <div className="max-w-xl text-white">
            <Reveal from="up">
              <h1 className="text-[2.7rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[3.8rem] lg:text-[5rem]">
                Stay close,
                <br />
                stay private.
              </h1>
            </Reveal>
            <Reveal from="up" delay={0.08}>
              <p className="mt-6 max-w-md text-lg leading-8 text-white/90">
                Simple, secure messaging and calling for everyone — free, encrypted, and in sync across all your devices.
              </p>
            </Reveal>
            <Reveal from="up" delay={0.16}>
              <div className="mt-8">
                <Button size="lg" onClick={openDownloadModal}>
                  Download <FiDownload />
                </Button>
              </div>
              <p className="mt-4 text-sm text-white/70">*Standard data rates may apply.</p>
            </Reveal>
          </div>

          {/* floating chat cards */}
          <div className="relative hidden h-full min-h-[440px] lg:block">
            <motion.div
              {...floatMotion(0.5)}
              className="absolute right-2 top-4 flex items-center gap-2 rounded-full bg-brand-strong px-4 py-2.5 text-white shadow-float"
            >
              <FiVideo /> <span className="text-sm font-semibold">Join</span>
            </motion.div>

            <motion.div
              {...floatMotion(0)}
              className="absolute right-14 top-20 w-64 rounded-2xl bg-white/95 p-3.5 shadow-float backdrop-blur"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e8f1ff] text-[#1550b5]">
                  <FiCalendar />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0e1a13]">Design Crew</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="flex -space-x-2">
                      {stackImages.map((img, index) => (
                        <img key={index} src={img} alt="" className="h-5 w-5 rounded-full border-2 border-white object-cover" />
                      ))}
                    </div>
                    <span className="text-xs text-[#7c877e]">&amp; 4 others</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...floatMotion(1)}
              className="absolute right-6 top-[13.5rem] rounded-2xl rounded-br-sm bg-[#dbeafe] px-4 py-2.5 shadow-float"
            >
              <p className="text-sm font-medium text-[#0e1a13]">
                Still on for tonight?
                <span className="ml-1.5 whitespace-nowrap text-[11px] text-[#4b5a53]">
                  20:53 <FiCheck className="inline text-brand-strong" />
                </span>
              </p>
            </motion.div>

            <motion.div
              {...floatMotion(0.7)}
              className="absolute right-16 top-[19rem] w-60 rounded-2xl bg-white/95 p-3.5 shadow-float backdrop-blur"
            >
              <div className="flex items-center gap-2">
                <img src={nadiaAvatar} alt="Nadia" className="h-8 w-8 rounded-full object-cover shadow-sm border border-stone-200" />
                <p className="text-sm font-bold text-[#0e1a13]">Nadia</p>
              </div>
              <p className="mt-2 text-sm text-[#4b5a53]">
                Ready when you are! <span className="text-[11px] text-[#7c877e]">20:59</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#f4efe6] px-2.5 py-1 text-sm">
                👍 ❤️ 😎
              </div>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  )
}
