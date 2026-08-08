import { useMemo } from 'react'
import { useSwipeable } from 'react-swipeable'
import { useTheme } from './useTheme'

const MIN_SWIPE_DISTANCE = 80

export function useSwipeTheme() {
  const { setTheme } = useTheme()

  const handlers = useSwipeable({
    onSwipedLeft: () => setTheme('dark'),
    onSwipedRight: () => setTheme('light'),
    delta: MIN_SWIPE_DISTANCE,
    preventScrollOnSwipe: false,
    trackTouch: true,
    trackMouse: false,
    rotationAngle: 0,
    touchAction: 'pan-y',
  })

  return useMemo(() => ({ handlers }), [handlers])
}
