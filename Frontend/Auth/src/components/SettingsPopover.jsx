import { useRef } from 'react';

const SettingsPopover = ({ 
  fontSize, 
  setFontSize, 
  tabSize, 
  setTabSize, 
  editorTheme, 
  setEditorTheme, 
  minimap, 
  setMinimap 
}) => {
  const popoverRef = useRef(null);

  const handleIncreaseFont = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 1);
    }
  };

  const handleDecreaseFont = () => {
    if (fontSize > 8) {
      setFontSize(fontSize - 1);
    }
  };

  const handleIncreaseTab = () => {
    if (tabSize < 8) {
      setTabSize(tabSize + 1);
    }
  };

  const handleDecreaseTab = () => {
    if (tabSize > 2) {
      setTabSize(tabSize - 1);
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute top-8 right-0 w-64 rounded-lg shadow-xl border border-base-300 bg-base-100 z-[9999]"
      role="dialog"
      aria-labelledby="settings-heading"
    >
      <div className="p-4 space-y-4">
        {/* Theme */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => setEditorTheme("vs")} 
              className={`w-full text-sm py-1.5 rounded-md transition-colors ${
                editorTheme === 'vs' 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300 text-base-content'
              }`}
            >
              Light
            </button>
            <button 
              onClick={() => setEditorTheme("vs-dark")} 
              className={`w-full text-sm py-1.5 rounded-md transition-colors ${
                editorTheme === 'vs-dark' 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300 text-base-content'
              }`}
            >
              Dark
            </button>
            <button 
              onClick={() => setEditorTheme("hc-black")} 
              className={`w-full text-sm py-1.5 rounded-md transition-colors ${
                editorTheme === 'hc-black' 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300 text-base-content'
              }`}
            >
              HC
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Font Size
          </label>
          <div className="flex items-center justify-between p-1 rounded-md bg-base-200">
            <button 
              onClick={handleDecreaseFont} 
              className="px-3 py-1 text-lg rounded font-bold text-base-content hover:bg-base-300"
            >
              -
            </button>
            <span className="text-sm font-mono text-base-content">
              {fontSize}px
            </span>
            <button 
              onClick={handleIncreaseFont} 
              className="px-3 py-1 text-lg rounded font-bold text-base-content hover:bg-base-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Tab Size */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Tab Size
          </label>
          <div className="flex items-center justify-between p-1 rounded-md bg-base-200">
            <button 
              onClick={handleDecreaseTab} 
              className="px-3 py-1 text-lg rounded font-bold text-base-content hover:bg-base-300"
            >
              -
            </button>
            <span className="text-sm font-mono text-base-content">
              {tabSize}
            </span>
            <button 
              onClick={handleIncreaseTab} 
              className="px-3 py-1 text-lg rounded font-bold text-base-content hover:bg-base-300"
            >
              +
            </button>
          </div>
        </div>

        {/* Minimap */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/70">
            Minimap
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => setMinimap(true)} 
              className={`w-full text-sm py-1.5 rounded-md transition-colors ${
                minimap 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300 text-base-content'
              }`}
            >
              On
            </button>
            <button 
              onClick={() => setMinimap(false)} 
              className={`w-full text-sm py-1.5 rounded-md transition-colors ${
                !minimap 
                  ? 'bg-primary text-primary-content' 
                  : 'bg-base-200 hover:bg-base-300 text-base-content'
              }`}
            >
              Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopover;