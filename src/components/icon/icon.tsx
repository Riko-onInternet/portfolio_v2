/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Image from "next/image";

import { X, Square, Minus, BringToFront } from "lucide-react";

import "./style.css";

interface IconProps {
  id: string;
  title: string;
  srcIcon: string;
  size: number;
  children: React.ReactNode;
  className?: string;
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
      setMaxZIndex((prev) => prev + 1);
      setOpenDialogs([
        ...openDialogs,
        {
          id,
          position: { x: 50, y: 50 },
          isFullScreen: false,
          zIndex: maxZIndex + 1,
        },
      ]);
    }
  };

  const bringToFront = (id: string) => {
    const dialog = openDialogs.find((d) => d.id === id);
    if (dialog && dialog.zIndex !== maxZIndex) {
      setMaxZIndex((prev) => prev + 1);
      setOpenDialogs(
        openDialogs.map((d) =>
          d.id === id ? { ...d, zIndex: maxZIndex + 1 } : d
        )
      );
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
    bringToFront,
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

export function Icon({
  id,
  title,
  srcIcon,
  size,
  children,
  className,
}: IconProps) {
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
          className="size-full drop-shadow-xl shadow-black"
          style={{ maxWidth: size, minHeight: size }}
        />
        <p
          className={`text-[var(--dialog-text)] text-sm text-center line-clamp-2 break-words drop-shadow-lg shadow-black ${className}`}
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
        <div className="text-xs absolute top-0 left-[12px] h-[40px] text-[var(--dialog-text)] flex items-center space-x-2">
          <Image src={srcIcon} alt={title} width={24} height={24} />
          <span>{title}</span>
        </div>
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

  // Controlla la dimensione dello schermo
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

  const dialogsStore = React.useContext(DialogsContext);
  const dialog = dialogsStore?.openDialogs.find((d) => d.id === id);

  const initDrag = (e: React.MouseEvent) => {
    if (isFullScreen) return;

    setIsDragging(true);
    dialogsStore?.bringToFront(id);

    const rect = headerRef.current?.getBoundingClientRect();
    const dialogRect = dialogRef.current?.getBoundingClientRect();

    if (rect && dialogRect) {
      const dragX = e.clientX - rect.left;
      const dragY = e.clientY - rect.top;

      const move = (e: MouseEvent) => {
        dialogsStore?.bringToFront(id);
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
              zIndex: dialog?.zIndex || 50,
            }
          : undefined
      }
      onMouseDown={() => dialogsStore?.bringToFront(id)}
    >
      <div
        className={`dialog-content bg-[var(--dialog-bg)] rounded-lg shadow-lg w-[500px] h-[600px] overflow-hidden ${
          isFullScreen ? "fullscreen-dialog rounded-none" : ""
        }`}
      >
        <div
          ref={headerRef}
          className="flex justify-start items-center flex-row-reverse cursor-move bg-[var(--dialog-bg-secondary)] h-[40px]"
          onMouseDown={initDrag}
        >
          <button
            onClick={onClose}
            className="size-[40px] text-[var(--dialog-text)] transition-all duration-200 hover:bg-red-500 hover:text-white flex items-center justify-center"
          >
            <X className="size-4" />
          </button>
          <button
            onClick={onFullScreenToggle}
            className="size-[40px] text-[var(--dialog-text)] transition-all duration-200 hover:bg-[var(--dialog-bg)] flex items-center justify-center"
          >
            <Square className="size-3" />
          </button>
          <button
            onClick={onClose}
            className="size-[40px] text-[var(--dialog-text)] transition-all duration-200 hover:bg-[var(--dialog-bg)] flex items-center justify-center"
          >
            <Minus className="size-4" />
          </button>
        </div>
        <div className="content-dialog">{children}</div>
      </div>
    </div>
  );
}
