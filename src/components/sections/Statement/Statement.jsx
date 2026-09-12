import { img, imgAlt } from '../../../utils/imageOverrides'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Container } from '../../common/Container/Container'
import { Reveal } from '../../common/Reveal/Reveal'
import { useLanguage } from '../../../context/LanguageContext'
import nadiaAvatar from '../../../assets/images/nadia_avatar.png'
import female1Avatar from '../../../assets/images/avatar_female_1.png'
import male1Avatar from '../../../assets/images/avatar_male_1.png'
import privateAvatar from '../../../assets/images/private.jpg'
import businessAvatar from '../../../assets/images/business.jpg'
import groupAvatar from '../../../assets/images/group.jpg'

const chips = [
  { text: 'Hello!', avatar: female1Avatar, side: 'received', pos: 'left-[7%] top-[12%]', vis: 'hidden sm:flex' },
  { text: 'Hola!', avatar: male1Avatar, side: 'sent', pos: 'left-[6%] top-[30%]', vis: 'hidden lg:flex' },
  { text: 'Ciao!', avatar: nadiaAvatar, side: 'received', pos: 'right-[8%] top-[12%]', vis: 'hidden lg:flex' },
  { text: 'Hallo!', avatar: privateAvatar, side: 'sent', pos: 'right-[6%] top-[28%]', vis: 'hidden sm:flex' },
  { text: 'Bonjour', avatar: businessAvatar, side: 'sent', pos: 'left-[6%] bottom-[16%]', vis: 'hidden sm:flex' },
  { text: 'Olá', avatar: groupAvatar, side: 'received', pos: 'right-[8%] bottom-[18%]', vis: 'hidden sm:flex' },
  { text: '안녕', avatar: female1Avatar, side: 'received', pos: 'left-[30%] bottom-[6%]', vis: 'hidden lg:flex' },
  { text: 'Namaste', avatar: male1Avatar, side: 'sent', pos: 'right-[29%] bottom-[8%]', vis: 'hidden lg:flex' },
]

export function Statement() {
  const boundsRef = useRef(null)
  const { t } = useLanguage()

  return (
    <section ref={boundsRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {chips.map((chip, index) => (
        <motion.div
          key={index}
          drag
          dragConstraints={boundsRef}
          dragElastic={0.16}
          dragMomentum={false}
          whileHover={{ scale: 1.06 }}
          whileDrag={{ scale: 1.12, zIndex: 50 }}
          className={`absolute z-0 cursor-grab touch-none select-none active:cursor-grabbing ${chip.pos} ${chip.vis}`}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.2 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2"
          >
            <img
              src={img(chip.avatar)}
              alt={imgAlt(chip.avatar, "private chat app user avatar")}
              className="h-10 w-10 shrink-0 rounded-full border-2 border-white object-cover shadow-soft"
            />
            <span
              className={`whitespace-nowrap rounded-2xl px-3 py-1.5 text-sm shadow-soft ${
                chip.side === 'sent'
                  ? 'bg-[#dbeafe] text-[#0e1a13] dark:bg-[#1e3a63] dark:text-white'
                  : 'border border-line bg-surface text-ink'
              }`}
            >
              {chip.text} <span className="ml-0.5 text-[10px] text-muted">11:59</span>
            </span>
          </motion.div>
        </motion.div>
      ))}

      <Container className="pointer-events-none relative z-10">
        <Reveal from="up" className="mx-auto max-w-4xl text-center">
          <h2 className="text-[1.8rem] font-bold leading-[1.3] tracking-tight text-ink sm:text-[2.3rem] lg:text-[2.8rem] lg:leading-[1.28]">
            {t('Why Choose KT Messenger?')}
          </h2>
          <p className="mt-4 text-[1.4rem] font-semibold leading-[1.35] text-ink sm:text-[1.8rem] lg:text-[2.1rem]">
            {t('Communication should be simple, private, and accessible.')}{' '}
            <span className="text-brand-ink">{t('KT Messenger brings everything you need to stay connected into one powerful platform.')}</span>
          </p>
          <p className="mt-4 text-base sm:text-lg text-body max-w-3xl mx-auto">
            {t('Unlike traditional messaging apps, KT Messenger combines secure messaging, calling, communities, and AI powered features to create a complete digital communication experience.')}
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
