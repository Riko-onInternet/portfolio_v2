"use client";

import React from "react";

import Image from "next/image";

const powerUp = "/img/button_power/power-up.png";
const powerDown = "/img/button_power/power-down.png";

import { Icon } from "@/components/icon/icon";

export default function Home() {
  const [isPressing, setIsPressing] = React.useState(false);
  const [isBooting, setIsBooting] = React.useState(false);

  // handle press
  const handlePress = () => setIsPressing(true);

  // handle release
  const handleRelease = () => {
    // set is pressing to false
    setIsPressing(false);
    console.log("accensione");

    // Effetto nascondi testo alla sezione "power"
    const powerText = document.getElementById("power-text");
    if (powerText) {
      setTimeout(() => {
        powerText.style.opacity = "0";
        setTimeout(() => {
          powerText.style.display = "none";
        }, 1000);
      }, 500);
    }

    // Effetto nascondi e blocca pulsante alla sezione "power"
    const buttonPower = document.getElementById("button-power");
    if (buttonPower) {
      buttonPower.style.pointerEvents = "none";
      setTimeout(() => {
        buttonPower.style.opacity = "0";
        setTimeout(() => {
          buttonPower.style.display = "none";
          // Attiva il boot dopo che il pulsante è scomparso
          setIsBooting(true);
        }, 1000);
      }, 2000);
    }

    // Effetto nascondi sezione "power"
    const sectionPower = document.getElementById("section-power");
    if (sectionPower) {
      setTimeout(() => {
        sectionPower.style.display = "none";
      }, 5000);
    }

    // Effetto mostra "progress bar" alla sezione "boot"
    const progressBarBoot = document.getElementById("progress-bar-boot");
    if (isBooting === true || progressBarBoot) {
      if (progressBarBoot) {
        setTimeout(() => {
          progressBarBoot.classList.add("loading");
        }, 5000);
      }
    }

    // Effetto nascondi sezione "boot" & contenuto "boot"
    const body = document.body;
    const sectionBoot = document.getElementById("section-boot");
    const sectionBootContent = document.getElementById("section-boot-content");
    if (sectionBootContent) {
      setTimeout(() => {
        sectionBootContent.style.display = "none";
      }, 8000);
    }
    if (sectionBoot) {
      setTimeout(() => {
        sectionBoot.style.display = "none";
        body.style.backgroundColor = "#1671e2";
      }, 10000);
    }

    // Effetto mostra sezione "login"
    const sectionLogin = document.getElementById("section-login");
    const sectionLoginContent = document.getElementById(
      "section-login-content"
    );
    if (sectionLoginContent) {
      setTimeout(() => {
        sectionLoginContent.style.opacity = "1";

        const progressBarLogin = document.getElementById("progress-bar-login");
        if (progressBarLogin) {
          setTimeout(() => {
            progressBarLogin.classList.add("loading");
          }, 10);
        }
      }, 11000);
    }
    // Effetto nascondi sezione "login"
    if (sectionLogin) {
      setTimeout(() => {
        sectionLogin.style.display = "none";
      }, 16000);
    }
  };

  return (
    <div className="h-dvh w-dvw relative">
      {/* Sezione Avvio */}
      <div
        className="w-full h-full bg-black absolute top-0 left-0 z-40"
        id="section-power"
      >
        <div className="h-full w-full flex justify-center items-center">
          <div className="size-[100px]">
            <button
              className="size-full transition-opacity duration-1000"
              id="button-power"
              onMouseDown={handlePress}
              onMouseUp={handleRelease}
              onTouchStart={handlePress}
              onTouchEnd={handleRelease}
            >
              <Image
                src={isPressing ? powerDown : powerUp}
                alt="Logo"
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm italic text-center transition-opacity duration-1000"
          id="power-text"
        >
          <p>Si consiglia di abbassare leggermente il volume</p>
        </div>
      </div>

      {/* Sezione Boot System */}
      <div
        className="w-full h-full bg-black absolute top-0 left-0 z-30"
        id="section-boot"
      >
        <div
          className="h-full w-full flex justify-center items-center"
          id="section-boot-content"
        >
          <div className="flex flex-col items-center">
            <div className="size-[100px] sm:size-[150px] mb-10">
              <Image
                src="/img/boot/windsos.webp"
                alt="Logo"
                width={150}
                height={150}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="progress-bar-boot" id="progress-bar-boot"></div>
          </div>
        </div>
      </div>

      {/* Sezione Login */}
      <div
        className="w-full h-full wallpaper absolute top-0 left-0 z-20"
        id="section-login"
      >
        <div
          className="h-full w-full flex flex-col justify-center items-center opacity-0 transition-opacity duration-500 backdrop-blur-xl bg-black/10"
          id="section-login-content"
        >
          <div className="size-[100px] sm:size-[150px] mb-4">
            <Image
              src="/img/login/user.png"
              alt="Logo"
              width={150}
              height={150}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <p className="text-white text-xl font-bold">User</p>
          <div className="progress-bar-login" id="progress-bar-login"></div>
        </div>
      </div>

      {/* Sezione Desktop */}
      <div
        className="w-full h-full wallpaper absolute top-0 left-0 z-10"
        id="section-desktop"
      >
        <div className="h-full w-full flex flex-col">
          <div className="h-full w-full grid direction-grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 grid-flow-col items-start justify-center p-4 sm:p-6">
            <Icon
              id="progetti_scolastici"
              title="Progetti Scolastici"
              srcIcon="/img/desktop/folder.png"
              size={80}
            >
              <p>Contenuto Progetti Scolastici</p>
            </Icon>

            <Icon
              id="progetti_in_corso"
              title="Progetti in corso"
              srcIcon="/img/desktop/folder.png"
              size={80}
            >
              <p>Contenuto Progetti in corso</p>
            </Icon>

            <Icon
              id="progetti_conclusi"
              title="Progetti conclusi"
              srcIcon="/img/desktop/folder.png"
              size={80}
            >
              <p>Contenuto Progetti conclusi</p>
            </Icon>

            <Icon
              id="impostazioni"
              title="Impostazioni"
              srcIcon="/img/desktop/settings.png"
              size={80}
            >
              <p>Contenuto Impostazioni</p>
            </Icon>

            <Icon
              id="about_me"
              title="About me.txt"
              srcIcon="/img/login/user.png"
              size={80}
            >
              <textarea placeholder="Scrivi qualcosa..." className="w-full h-full bg-transparent border-none outline-none resize-none text-sm" defaultValue={""} />
            </Icon>
          </div>
          <div className="max-h-[50px] h-full w-full bg-[#1c1c1c] border-t border-[#404040]">
            <div className="w-full h-full px-3 py-[2px] flex items-center justify-start">
              <button className="hover:bg-zinc-800 transition-all duration-200 rounded-md size-[45px] flex justify-center items-center">
                <Image
                  src="/img/boot/windsos.webp"
                  alt="Windows Logo"
                  width={25}
                  height={25}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
