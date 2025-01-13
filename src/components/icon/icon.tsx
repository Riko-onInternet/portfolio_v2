/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import Image from "next/image";

import { X, Square, Minus } from "lucide-react";

import "./style.css";

interface IconProps {
  id: string;
  title: string;
  srcIcon: string;
  size: number;
  children: React.ReactNode;
}

// Stato globale per le finestre aperte
const useDialogsStore = () => {
  const [openDialogs, setOpenDialogs] = React.useState<
    {
      id: string;
      position: { x: number; y: number };
      isFullScreen: boolean;
    }[]
  >([]);

  const handleOpen = (id: string) => {
    if (!openDialogs.find((dialog) => dialog.id === id)) {
      setOpenDialogs([
        ...openDialogs,
        {
          id,
          position: { x: 50, y: 50 },
          isFullScreen: false,
        },
      ]);
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
  };
};

const DialogsContext = React.createContext<ReturnType<
  typeof useDialogsStore
> | null>(null);

export function DialogsProvider({ children }: { children: React.ReactNode }) {
  const store = useDialogsStore();
  return (
    <DialogsContext.Provider value={store}>{children}</DialogsContext.Provider>
  );
}

export function Icon({ id, title, srcIcon, size, children }: IconProps) {
  const dialogsStore = React.useContext(DialogsContext);
  if (!dialogsStore)
    throw new Error("Icon must be used within DialogsProvider");

  const dialog = dialogsStore.openDialogs.find((d) => d.id === id);

  return (
    <>
      <div
        onDoubleClick={() => dialogsStore.handleOpen(id)}
        className="cursor-pointer flex flex-col items-top justify-center"
        style={{ maxWidth: size, minHeight: size }}
      >
        <Image
          src={srcIcon}
          alt={title}
          width={size}
          height={size}
          className="size-full drop-shadow-xl shadow-black "
        />
        <p
          className="text-white text-sm text-center line-clamp-2 drop-shadow-lg shadow-black"
          title={title}
        >
          {title}
        </p>
      </div>

      <IconContent
        id={id}
        isOpen={!!dialog}
        position={dialog?.position || { x: 50, y: 50 }}
        isFullScreen={dialog?.isFullScreen || false}
        onClose={() => dialogsStore.handleClose(id)}
        onPositionChange={(pos) => dialogsStore.updatePosition(id, pos)}
        onFullScreenToggle={() => dialogsStore.toggleFullScreen(id)}
      >
        {children}
      </IconContent>
    </>
  );
}

interface IconContentProps {
  id: string;
  isOpen: boolean;
  position: { x: number; y: number };
  isFullScreen: boolean;
  onClose: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onFullScreenToggle?: () => void;
  children: React.ReactNode;
}

export function IconContent({
  id,
  isOpen,
  position: initialPosition,
  isFullScreen: propIsFullScreen,
  onClose,
  onPositionChange,
  onFullScreenToggle,
  children,
}: IconContentProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState(initialPosition);

  // Controlla la dimensione dello schermo
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Combina isFullScreen da props con isSmallScreen
  const isFullScreen = propIsFullScreen || isSmallScreen;

  const initDrag = (e: React.MouseEvent) => {
    if (isFullScreen) return;

    setIsDragging(true);
    const rect = headerRef.current?.getBoundingClientRect();
    const dialogRect = dialogRef.current?.getBoundingClientRect();

    if (rect && dialogRect) {
      const dragX = e.clientX - rect.left;
      const dragY = e.clientY - rect.top;

      const move = (e: MouseEvent) => {
        const left = e.clientX - dragX;
        const top = e.clientY - dragY;
        const newPosition = { x: left, y: top };

        setPosition(newPosition);
        if (onPositionChange) {
          onPositionChange(newPosition);
        }
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

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      className={`dialog ${isFullScreen ? "fullscreen" : ""}`}
      style={
        !isFullScreen
          ? {
              position: "fixed",
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
          : undefined
      }
    >
      <div
        className={`dialog-content bg-white rounded-lg shadow-lg w-[500px] h-[600px] overflow-hidden ${
          isFullScreen ? "fullscreen-dialog rounded-none" : ""
        }`}
      >
        <div
          ref={headerRef}
          className="flex justify-start items-center flex-row-reverse cursor-move bg-gray-100 h-[40px]"
          onMouseDown={initDrag}
        >
          <button
            onClick={onClose}
            className="size-[40px] transition-all duration-200 hover:bg-red-500 flex items-center justify-center"
          >
            <X className="size-4" />
          </button>
          <button
            onClick={onFullScreenToggle}
            className="size-[40px] transition-all duration-200 hover:bg-gray-200 flex items-center justify-center"
          >
            <Square className="size-3" />
          </button>
          <button
            onClick={onClose}
            className="size-[40px] transition-all duration-200 hover:bg-gray-200 flex items-center justify-center"
          >
            <Minus className="size-4" />
          </button>
        </div>
        <div className="content-dialog">
          {children}
        </div>
      </div>
    </div>
  );
}
