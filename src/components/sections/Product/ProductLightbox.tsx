import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RED } from '@/styles/theme';
import type { Product } from './types';

interface Props {
  product: Product;
  lightboxIdx: number | null;
  galleryImages: string[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  setLightboxIdx: (i: number) => void;
}

export const ProductLightbox = ({
  product,
  lightboxIdx,
  galleryImages,
  onClose,
  onPrev,
  onNext,
  setLightboxIdx,
}: Props) => (
  <AnimatePresence>
    {lightboxIdx !== null && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.96)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <button className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10" onClick={onClose}>
          <X className="w-7 h-7" />
        </button>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm font-mono tracking-widest">
          {String(lightboxIdx + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
        </div>
        <button className="absolute left-4 sm:left-8 text-gray-400 hover:text-white z-10 p-2"
          onClick={e => { e.stopPropagation(); onPrev(); }}>
          <ChevronLeft className="w-10 h-10" />
        </button>
        <img
          key={lightboxIdx}
          src={galleryImages[lightboxIdx]}
          alt={`${product.shortName} — ${lightboxIdx + 1}`}
          className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
          onClick={e => e.stopPropagation()}
        />
        <button className="absolute right-4 sm:right-8 text-gray-400 hover:text-white z-10 p-2"
          onClick={e => { e.stopPropagation(); onNext(); }}>
          <ChevronRight className="w-10 h-10" />
        </button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {galleryImages.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setLightboxIdx(i); }}
              className="rounded-full transition-all duration-300"
              style={{ width: i === lightboxIdx ? 24 : 8, height: 8, background: i === lightboxIdx ? RED : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
