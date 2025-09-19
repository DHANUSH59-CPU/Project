// ShareModal.jsx
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import FocusTrap from 'focus-trap-react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedInIcon,
  EnvelopeIcon,
  WhatsAppIcon
} from '../Icons/SolveProblemPageIcons';
import { Copy as ClipboardCopyIcon } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, problem }) => {
  const modalRef = useRef(null);

  const { title: problemTitle } = problem
  const problemUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://www.hackforge.dev/problems/${problem._id}`;

  const shareTextForSocial = `Check out the problem: "${problemTitle}" on HackForge!`;
  const shareMessageForCopy = `I'm working on the "${problemTitle}" problem on HackForge!\nCheck it out: <${problemUrl}>`;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!', {
        style: {
          background: '#fff',
          color: '#000'
        },
        className: 'dark:bg-slate-800 dark:text-white'
      });
    }).catch(() => {
      toast.error('Failed to copy', {
        style: {
          background: '#fff',
          color: '#000'
        },
        className: 'dark:bg-slate-800 dark:text-white'
      });
    });
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: TwitterIcon,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextForSocial)}&url=${encodeURIComponent(problemUrl)}`
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(problemUrl)}&quote=${encodeURIComponent(shareTextForSocial)}`
    },
    {
      name: 'LinkedIn',
      icon: LinkedInIcon,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(problemUrl)}&title=${encodeURIComponent(problemTitle)}&summary=${encodeURIComponent(shareTextForSocial)}`
    },
    {
      name: 'Email',
      icon: EnvelopeIcon,
      url: `mailto:?subject=${encodeURIComponent(problemTitle)}&body=${encodeURIComponent(shareTextForSocial + "\n\nLink: " + problemUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: WhatsAppIcon,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextForSocial + " " + problemUrl)}`
    },
  ];

  const commonButtonClass = `p-2 rounded-lg flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800`;
  const socialIconClass = 'w-6 h-6';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
          onClick={onClose}
        >
          <FocusTrap active={isOpen}>
            <motion.div
              ref={modalRef}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl p-8 rounded-xl shadow-2xl bg-white dark:bg-slate-800 scale-80"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 id="share-modal-title" className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                  Share "{problemTitle}"
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 dark:text-slate-400 dark:hover:bg-slate-700 focus:ring-orange-500"
                  aria-label="Close share modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Copy Problem Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-slate-300">
                  Copy problem link:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={problemUrl}
                    className="flex-grow p-2.5 border rounded-md text-sm shadow-sm bg-gray-50 border-gray-300 text-gray-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  />
                  <button
                    onClick={() => handleCopy(problemUrl)}
                    className={`${commonButtonClass} px-4 text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 focus:ring-orange-500`}
                  >
                    <ClipboardCopyIcon className="w-5 h-5 mr-1.5" /> Copy Link
                  </button>
                </div>
              </div>

              {/* Copy Text with Link */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-slate-300">
                  Copy text with link:
                </label>
                <div className="flex space-x-2">
                  <textarea
                    readOnly
                    value={shareMessageForCopy}
                    rows={3}
                    className="flex-grow p-2.5 border rounded-md text-sm shadow-sm resize-none bg-gray-50 border-gray-300 text-gray-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                  />
                  <button
                    onClick={() => handleCopy(shareMessageForCopy)}
                    className={`${commonButtonClass} px-4 text-sm font-medium self-start bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 focus:ring-orange-500`}
                  >
                    <ClipboardCopyIcon className="w-5 h-5 mr-1.5" /> Copy Text
                  </button>
                </div>
              </div>

              {/* Social Icons */}
              <div className="mb-8">
                <p className="text-sm font-medium mb-4 text-gray-600 dark:text-slate-300">
                  Or share via:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {socialPlatforms.map(platform => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${commonButtonClass} flex-col space-y-1 h-20 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-orange-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 dark:hover:text-orange-400 focus:ring-orange-500`}
                      aria-label={`Share on ${platform.name}`}
                    >
                      <platform.icon className={socialIconClass} />
                      <span className="text-xs">{platform.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <p className="text-sm font-medium mb-2 text-gray-600 dark:text-slate-300">Scan to open on your phone:</p>
                <div className="inline-block p-3 bg-white rounded-lg shadow">
                  <QRCode value={problemUrl} size={128} fgColor="#000000" bgColor="transparent" />
                </div>
              </div>
            </motion.div>
          </FocusTrap>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;