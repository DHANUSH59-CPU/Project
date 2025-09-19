import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPopover = ({ fontSize, setFontSize, tabSize, setTabSize, editorTheme, setEditorTheme, minimap, setMinimap }) => {
  const popoverRef = useRef(null);

  const popoverStyle = {
    position: 'absolute',
    top: 34,
    right: 0,
  };

  const popoverBg = 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700';
  const textColor = 'text-gray-600 dark:text-gray-300';
  const controlBg = 'bg-gray-100 dark:bg-gray-900';
  const buttonTextColor = 'text-gray-700 dark:text-gray-200';
  const activeBtnClasses = 'bg-orange-500 text-white';
  const inactiveBtnClasses = 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600';

  const handleIncreaseFont = () => {
    if(fontSize<24)
        setFontSize(fontSize + 1);
  }

  const handleDecreaseFont = () => {
    if(fontSize>8)
        setFontSize(fontSize - 1);
  }

  const handleIncreaseTab = () => {
    if(tabSize<8)
        setTabSize(tabSize + 1);
  }

  const handleDecreaseTab = () => {
    if(tabSize>2)
        setTabSize(tabSize - 1);
  }

  return (
    <AnimatePresence>
        <motion.div
            ref={popoverRef}
            style={popoverStyle}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`w-64 rounded-lg shadow-2xl border ${popoverBg} z-10`}
            role="dialog"
            aria-labelledby="settings-heading"
        >
            <div className="p-4 space-y-4">
            {/* Theme */}
            <div className="space-y-2">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${textColor}`}>Theme</label>
                <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setEditorTheme("vs")} className={`w-full text-sm py-1.5 rounded-md transition-colors ${editorTheme==='vs'?activeBtnClasses:inactiveBtnClasses}`}>vs</button>
                <button onClick={() => setEditorTheme("vs-dark")} className={`w-full text-sm py-1.5 rounded-md transition-colors ${editorTheme==='vs-dark'?activeBtnClasses:inactiveBtnClasses}`}>vs-dark</button>
                <button onClick={() => setEditorTheme("hc-black")} className={`w-full text-sm py-1.5 rounded-md transition-colors ${editorTheme==='hc-black'?activeBtnClasses:inactiveBtnClasses}`}>hc-black</button>
                </div>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${textColor}`}>Font Size</label>
                <div className={`flex items-center justify-between p-1 rounded-md ${controlBg}`}>
                <button onClick={handleDecreaseFont} className={`px-3 py-1 text-lg rounded font-bold ${buttonTextColor}`}>-</button>
                <span className={`text-sm font-mono ${buttonTextColor}`}>{`${fontSize}px`}</span>
                <button onClick={handleIncreaseFont} className={`px-3 py-1 text-lg rounded font-bold ${buttonTextColor}`}>+</button>
                </div>
            </div>

            {/* Tab Size */}
            <div className="space-y-2">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${textColor}`}>Tab Size</label>
                <div className={`flex items-center justify-between p-1 rounded-md ${controlBg}`}>
                <button onClick={handleDecreaseTab} className={`px-3 py-1 text-lg rounded font-bold ${buttonTextColor}`}>-</button>
                <span className={`text-sm font-mono ${buttonTextColor}`}>{`${tabSize}`}</span>
                <button onClick={handleIncreaseTab} className={`px-3 py-1 text-lg rounded font-bold ${buttonTextColor}`}>+</button>
                </div>
            </div>

            {/* Minimap */}
            <div className="space-y-2">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${textColor}`}>Minimap</label>
                <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setMinimap(true)} className={`w-full text-sm py-1.5 rounded-md transition-colors ${minimap?activeBtnClasses:inactiveBtnClasses}`}>On</button>
                <button onClick={() => setMinimap(false)} className={`w-full text-sm py-1.5 rounded-md transition-colors ${minimap?inactiveBtnClasses:activeBtnClasses}`}>Off</button>
                </div>
            </div>
            </div>
        </motion.div>
    </AnimatePresence>
  );
};

export default SettingsPopover;
