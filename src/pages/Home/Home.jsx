import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { Hero } from '../../components/sections/Hero/Hero'
import { TrustBar } from '../../components/sections/TrustBar/TrustBar'
import { Statement } from '../../components/sections/Statement/Statement'
import { LoopWeb } from '../../components/sections/LoopWeb/LoopWeb'
import { MultiDevice } from '../../components/sections/MultiDevice/MultiDevice'
import { Calling } from '../../components/sections/Calling/Calling'
import { Privacy } from '../../components/sections/Privacy/Privacy'
import { Groups } from '../../components/sections/Groups/Groups'
import { Expression } from '../../components/sections/Expression/Expression'
import { Business } from '../../components/sections/Business/Business'
import { Features } from '../../components/sections/Features/Features'
import { VideoShowcase } from '../../components/sections/VideoShowcase/VideoShowcase'
import { DownloadCTA } from '../../components/sections/DownloadCTA/DownloadCTA'

export function Home() {
  return (
    <MainLayout>
      <Hero />
      <TrustBar />
      <VideoShowcase />
      <Statement />
      <LoopWeb />
      <MultiDevice />
      <Calling />
      <Privacy />
      <Groups />
      <Expression />
      <Business />
      <Features />
      <DownloadCTA />
    </MainLayout>
  )
}
