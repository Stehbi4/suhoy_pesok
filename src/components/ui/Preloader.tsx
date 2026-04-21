import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroFrameAnimation from '../HeroFrameAnimation';
import { LOGO_FPS_PRELOADER, LOGO_FRAMES, LOGO_FRAMES_PATH } from '@/config/logoFrames';

// ── Assets to preload across Home / About / Contacts ────────────────────────
const PRELOAD_IMAGES = [
  '/HeroSent/sand-pile_1.png',
  '/HeroSent/sand-pile.png',
  '/Car_Cem_Dilivery.jpg',
  '/Soft_Sand_Containers_x.png',
  '/About_BG.jpg',
  '/CMID_Bilding-3.jpg',
  '/CMID_Bilding.png',
  '/production.jpg',
  '/laboratory.jpg',
  '/sand-macro.jpg',
  '/Logo/logo-light.png',
  '/Logo/logo-dark.png',
];

// Videos preloaded via hidden <video> elements added to the DOM
const PRELOAD_VIDEOS = [
  '/HeroSent/part%201.mp4',
  '/HeroSent/part%202.mp4',
];

const MIN_SHOW_MS = 2400; // minimum visible time so animation completes at least one cycle

interface Props {
  onDone: () => void;
}

const Preloader = ({ onDone }: Props) => {
  const [visible, setVisible] = useState(true);

  const finish = useCallback(() => {
    setVisible(false);
    setTimeout(onDone, 750);
  }, [onDone]);

  useEffect(() => {
    let loaded = 0;
    const total = PRELOAD_IMAGES.length;
    let minDone   = false;
    let assetsDone = false;

    const tryFinish = () => {
      if (minDone && assetsDone) finish();
    };

    // Preload images
    PRELOAD_IMAGES.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= total) { assetsDone = true; tryFinish(); }
      };
      img.src = src;
    });

    // Inject hidden video elements so the browser starts buffering them
    const videoEls = PRELOAD_VIDEOS.map(src => {
      const v = document.createElement('video');
      v.src = src;
      v.preload = 'auto';
      v.muted = true;
      v.style.display = 'none';
      document.body.appendChild(v);
      return v;
    });

    const minTimer = setTimeout(() => { minDone = true; tryFinish(); }, MIN_SHOW_MS);

    return () => {
      clearTimeout(minTimer);
      videoEls.forEach(v => v.remove());
    };
  }, [finish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
        >
          <div style={{ width: 150, height: 150 }}>
            <HeroFrameAnimation
              framesPath={LOGO_FRAMES_PATH}
              frameCount={LOGO_FRAMES}
              fps={LOGO_FPS_PRELOADER}
              loop
              frameExt="webp"
              className="w-full h-full"
              style={{ display: 'block' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
