/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Square, Minus, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import "./style.css";

interface BrowserProps {
  id: string;
  title: string;
  srcBrowser: string;
  size: number;
  defaultUrl?: string;
  children?: React.ReactNode;
}

// Stato globale per le finestre aperte
const useDialogsStore = () => {
  const [openDialogs, setOpenDialogs] = React.useState<
    {
      id: string;
      position: { x: number; y: number };
      isFullScreen: boolean;
      zIndex: number;
    }[]
  >([]);

  const [maxZIndex, setMaxZIndex] = useState(50);

  const handleOpen = (id: string) => {
    if (!openDialogs.find((dialog) => dialog.id === id)) {
      setMaxZIndex(prev => prev + 1);
      setOpenDialogs([
        ...openDialogs,
        {
          id,
          position: { x: 50, y: 50 },
          isFullScreen: false,
          zIndex: maxZIndex + 1
        },
      ]);
    }
  };

  const bringToFront = (id: string) => {
    const dialog = openDialogs.find(d => d.id === id);
    if (dialog && dialog.zIndex !== maxZIndex) {
      setMaxZIndex(prev => prev + 1);
      setOpenDialogs(openDialogs.map(d => 
        d.id === id 
          ? { ...d, zIndex: maxZIndex + 1 }
          : d
      ));
    }
  };

  const handleClose = (id: string) => {
    setOpenDialogs(openDialogs.filter((dialog) => dialog.id !== id));
  };

  const updatePosition = (id: string, position: { x: number; y: number }) => {
    setOpenDialogs(
      openDialogs.map((dialog) =>
        dialog.id === id ? { ...dialog, position } : dialog
      )
    );
  };

  const toggleFullScreen = (id: string) => {
    setOpenDialogs(
      openDialogs.map((dialog) =>
        dialog.id === id
          ? { ...dialog, isFullScreen: !dialog.isFullScreen }
          : dialog
      )
    );
  };

  return {
    openDialogs,
    handleOpen,
    handleClose,
    updatePosition,
    toggleFullScreen,
    bringToFront
  };
};

const DialogsContext = React.createContext<ReturnType<typeof useDialogsStore> | null>(null);

export function DialogsProvider({ children }: { children: React.ReactNode }) {
  const store = useDialogsStore();
  return (
    <DialogsContext.Provider value={store}>{children}</DialogsContext.Provider>
  );
}

export function Browser({ id, title, srcBrowser, size, defaultUrl = "https://www.google.com", children }: BrowserProps) {
  const dialogsStore = React.useContext(DialogsContext);
  if (!dialogsStore) throw new Error("Browser must be used within DialogsProvider");

  const dialog = dialogsStore.openDialogs.find((d) => d.id === id);
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 50, y: 50 });
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);
  const [urlInput, setUrlInput] = useState(defaultUrl);
  const [history, setHistory] = useState<string[]>([defaultUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Controlla la dimensione dello schermo
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const isFullScreen = dialog?.isFullScreen || isSmallScreen;

  const initDrag = (e: React.MouseEvent) => {
    if (isFullScreen) return;

    setIsDragging(true);
    dialogsStore.bringToFront(id);

    const rect = headerRef.current?.getBoundingClientRect();
    const dialogRect = dialogRef.current?.getBoundingClientRect();

    if (rect && dialogRect) {
      const dragX = e.clientX - rect.left;
      const dragY = e.clientY - rect.top;

      const move = (e: MouseEvent) => {
        dialogsStore.bringToFront(id);
        const left = e.clientX - dragX;
        const top = e.clientY - dragY;
        const newPosition = { x: left, y: top };

        setPosition(newPosition);
        dialogsStore.updatePosition(id, newPosition);
      };

      const endDrag = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", endDrag);
      };

      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", endDrag);
    }
  };

  const navigateTo = (url: string) => {
    try {
      // Rimuovi spazi iniziali e finali
      let formattedUrl = url.trim();
      
      // Se è solo un dominio (es: google.it), aggiungi https://www
      if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(formattedUrl)) {
        formattedUrl = `https://www.${formattedUrl}`;
      }
      // Se inizia con www., aggiungi https://
      else if (formattedUrl.startsWith('www.')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      // Se non ha http:// o https://, aggiungilo
      else if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      // Valida l'URL
      new URL(formattedUrl);

      setIsLoading(true);
      setCurrentUrl(formattedUrl);
      setUrlInput(formattedUrl);
      
      // Aggiorna la cronologia
      const newHistory = [...history.slice(0, historyIndex + 1), formattedUrl];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } catch (e) {
      // Se l'URL non è valido, fai una ricerca su Google
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      setCurrentUrl(searchUrl);
      setUrlInput(searchUrl);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setCurrentUrl(history[historyIndex - 1]);
      setUrlInput(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setCurrentUrl(history[historyIndex + 1]);
      setUrlInput(history[historyIndex + 1]);
    }
  };

  const handleRefresh = () => {
    setCurrentUrl(prev => prev);
  };

  return (
    <>
      <div
        onDoubleClick={() => dialogsStore.handleOpen(id)}
        className="cursor-pointer flex flex-col items-center justify-center"
        style={{ maxWidth: size, minHeight: size }}
      >
        <Image
          src={srcBrowser}
          alt={title}
          width={size}
          height={size}
          className="size-full drop-shadow-xl shadow-black"
        />
        <p className="text-[var(--dialog-text)] text-sm text-center line-clamp-2 drop-shadow-lg shadow-black">
          {title}
        </p>
      </div>

      {dialog && (
        <div
          ref={dialogRef}
          className={`dialog ${isFullScreen ? "fullscreen" : ""}`}
          style={
            !isFullScreen
              ? {
                  position: "fixed",
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  zIndex: dialog.zIndex || 50,
                }
              : undefined
          }
          onMouseDown={initDrag}
        >
          <div
            className={`dialog-content bg-[var(--dialog-bg)] rounded-lg shadow-lg w-[800px] h-[600px] overflow-hidden ${
              isFullScreen ? "fullscreen-dialog rounded-none" : ""
            }`}
          >
            <div
              ref={headerRef}
              className="flex justify-between items-center bg-[var(--dialog-bg-secondary)] h-[40px]"
              onMouseDown={initDrag}
            >
              {/* Pulsanti di navigazione */}
              <div className="flex items-center px-2 gap-2">
                <button 
                  onClick={handleBack}
                  disabled={historyIndex === 0}
                  className="size-6 rounded-full bg-[var(--dialog-border)] hover:opacity-80 flex items-center justify-center text-[var(--dialog-text)] disabled:opacity-50"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button 
                  onClick={handleForward}
                  disabled={historyIndex === history.length - 1}
                  className="size-6 rounded-full bg-[var(--dialog-border)] hover:opacity-80 flex items-center justify-center text-[var(--dialog-text)] disabled:opacity-50"
                >
                  <ArrowRight className="size-4" />
                </button>
                <button 
                  onClick={handleRefresh}
                  className="size-6 rounded-full bg-[var(--dialog-border)] hover:opacity-80 flex items-center justify-center text-[var(--dialog-text)]"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>

              {/* Barra degli indirizzi interattiva */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  navigateTo(urlInput);
                }}
                className="flex-1 mx-2"
              >
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-full bg-[var(--dialog-bg)] rounded-md px-3 py-1 text-sm text-[var(--dialog-text)] outline-none border border-transparent focus:border-blue-500"
                  placeholder="Cerca o inserisci un indirizzo web"
                />
              </form>

              {/* Pulsanti di controllo finestra */}
              <div className="flex">
                <button
                  onClick={() => dialogsStore.handleClose(id)}
                  className="size-[40px] text-[var(--dialog-text)] transition-all duration-200 hover:bg-[var(--dialog-bg)] flex items-center justify-center"
                >
                  <Minus className="size-4" />
                </button>
                <button
                  onClick={() => dialogsStore.toggleFullScreen(id)}
                  className="size-[40px] text-[var(--dialog-text)] transition-all duration-200 hover:bg-[var(--dialog-bg)] flex items-center justify-center"
                >
                  <Square className="size-3" />
                </button>
                <button
                  onClick={() => dialogsStore.handleClose(id)}
                  className="size-[40px] text-[var(--dialog-text)] transition-all duration-200 hover:bg-red-500 hover:text-white flex items-center justify-center"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <div className="content-dialog-browser overflow-hidden relative">
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--dialog-bg)]">
                  <div className="h-full bg-blue-500 animate-loading-bar"></div>
                </div>
              )}
              <iframe
                src={currentUrl}
                className="w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="no-referrer"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
