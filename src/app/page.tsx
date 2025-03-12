"use client";

// React
import React, { useState, useEffect } from "react";

// NextUI
import { Switch } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";

// Next
import Image from "next/image";
import Cookies from "js-cookie";
// import Link from "next/link";

// Assets
const powerUp = "/img/button_power/power-up.png";
const powerDown = "/img/button_power/power-down.png";

// Components
import { Icon } from "@/components/icon/icon";
import { Browser } from "@/components/browser/browser";

// Aggiungi questo tipo per i temi
type Theme = "light" | "dark" | "system" | "mixed";

// Aggiungi questo tipo per i wallpapers
type Wallpaper = "1" | "2" | "3";

// text content
import { aboutContent } from "@/data/about";
import { reazerReplica } from "@/data/reazer_replica";
import { soulKitchen } from "@/data/soul-kitchen";
import { untimed } from "@/data/untimed";
import { collinadoro } from "@/data/collinadoro";
import { afrodite } from "@/data/afrodite";
import { tlt } from "@/data/tlt";

// database links
const schoolProjects = [
  {
    title: "Replica Reazer",
    linkGithub: "https://github.com/Riko-onInternet/razer",
    linkWebsite: "https://razer-wine.vercel.app/",
    icon: "/img/desktop/chrome.png",
    id: "replica_reazer",
    idText: "text-reazer_replica",
    textValue: reazerReplica,
  },
  {
    title: "Soul Kitchen",
    linkGithub: "https://github.com/Riko-onInternet/soul_kitchen",
    linkWebsite: "https://soul-kitchen-theta.vercel.app/",
    icon: "/img/desktop/chrome.png",
    id: "soul_kitchen",
    idText: "text-soul_kitchen",
    textValue: soulKitchen,
  },
  {
    title: "Untimed",
    linkGithub: "https://github.com/Riko-onInternet/untimed",
    linkWebsite: "https://untimed.vercel.app/",
    icon: "/img/desktop/chrome.png",
    id: "untimed",
    idText: "text-untimed",
    textValue: untimed,
  },
  {
    title: "Collina d'oro",
    linkGithub: "https://github.com/Riko-onInternet/collinadoro",
    linkWebsite: "https://collinadoro.vercel.app/",
    icon: "/img/desktop/chrome.png",
    id: "collina_doro",
    idText: "text-collina_doro",
    textValue: collinadoro,
  },
  {
    title: "Afrodite",
    linkGithub: "https://github.com/Riko-onInternet/afrodite",
    linkWebsite: "https://afrodite-mu.vercel.app/",
    icon: "/img/desktop/chrome.png",
    id: "afrodite",
    idText: "text-afrodite",
    textValue: afrodite,
  },
  {
    title: "The Living Tombstone",
    linkGithub: "https://github.com/Riko-onInternet/thelivingtombstone",
    linkWebsite: "https://thelivingtombstone.vercel.app/",
    icon: "/img/desktop/chrome.png",
    id: "tlt",
    idText: "text-tlt",
    textValue: tlt,
  },
];

const continuedProject = [
  {
    id: "unknown",
    title: "unKnown",
    linkGithub: "",
    linkWebsite: "",
    icon: "/img/desktop/chrome.png",
  },
  {
    id: "riko_ui",
    title: "Riko_UI",
    linkGithub: "",
    linkWebsite: "",
    icon: "/img/desktop/chrome.png",
  },
];

export default function Home() {
  const [isPressing, setIsPressing] = React.useState(false);
  const [isBooting, setIsBooting] = React.useState(false);

  // Inizializza skipIntro con false come valore di default
  const [skipIntro, setSkipIntro] = useState(false);

  // Stato per il tema
  const [theme, setTheme] = useState<Theme>("mixed");

  // Stato per il wallpaper
  const [wallpaper, setWallpaper] = useState<Wallpaper>("1");

  // Stato per il testo di about
  const [aboutText, setAboutText] = useState(aboutContent);

  // Sposta la lettura dei cookie in un useEffect
  useEffect(() => {
    const savedValue = Cookies.get("skipIntro");
    if (savedValue !== undefined) {
      setSkipIntro(JSON.parse(savedValue));
    }
  }, []);

  // Salva nei cookie quando skipIntro cambia
  useEffect(() => {
    Cookies.set("skipIntro", JSON.stringify(skipIntro), { expires: 365 });
  }, [skipIntro]);

  // Effetto per caricare il tema dai cookie
  useEffect(() => {
    const savedTheme = Cookies.get("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Effetto per applicare il tema
  useEffect(() => {
    // Salva nei cookie
    Cookies.set("theme", theme, { expires: 365 });

    // Rimuovi tutte le classi dei temi
    document.body.classList.remove("theme-light", "theme-dark", "theme-mixed");

    // Se il tema è "system", usa le preferenze del sistema
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.body.classList.add(`theme-${systemTheme}`);
      console.log(`Tema di sistema rilevato: ${systemTheme}`);
    } else {
      // Altrimenti usa il tema selezionato
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  // Aggiungi un listener per il tema di sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        document.body.classList.remove(
          "theme-light",
          "theme-dark",
          "theme-mixed"
        );
        document.body.classList.add(`theme-${systemTheme}`);
        console.log(`Tema di sistema cambiato a: ${systemTheme}`);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Effetto per caricare il wallpaper dai cookie
  useEffect(() => {
    const savedWallpaper = Cookies.get("wallpaper") as Wallpaper;
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }
  }, []);

  // Effetto per salvare il wallpaper nei cookie
  useEffect(() => {
    Cookies.set("wallpaper", wallpaper, { expires: 365 });
  }, [wallpaper]);

  // Aggiungi questo effetto per salvare il testo nei cookie
  useEffect(() => {
    Cookies.set("aboutText", aboutText, { expires: 365 });
  }, [aboutText]);

  // Funzione di utilità per riprodurre audio
  const playAudio = (audioId: string, volume: number = 1) => {
    const audio = document.getElementById(audioId) as HTMLAudioElement;
    if (audio) {
      // Reset dell'audio prima della riproduzione
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch((error) => {
        console.log(`Errore durante la riproduzione dell'audio: ${error}`);
      });
    }
  };

  // handle press
  const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsPressing(true);
    // Riproduci audio button in
    playAudio("clickIN", 0.5);
  };

  // handle release
  const handleRelease = (e: React.MouseEvent | React.TouchEvent) => {
    console.log("accensione");

    e.preventDefault();
    setIsPressing(false);

    // Riproduzione audio
    playAudio("clickOUT", 0.5);
    playAudio("fanPC", 0.8);

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
        body.style.backgroundColor = "#1c1c1c";
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
        setTimeout(() => {
          playAudio("startOS");
        }, 1);
      }, 16000);
    }
  };

  return (
    <>
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
          className="w-full h-full absolute top-0 left-0 bg-cover bg-center bg-no-repeat z-20"
          style={{
            backgroundImage: `url(/img/wallpaper/wallpaper_${wallpaper}.jpg)`,
          }}
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
          className={`w-full h-full absolute top-0 left-0 bg-cover bg-center bg-no-repeat z-10`}
          style={{
            backgroundImage: `url(/img/wallpaper/wallpaper_${wallpaper}.jpg)`,
          }}
          id="section-desktop"
        >
          <div className="h-full w-full flex flex-col">
            <div className="h-full w-full grid direction-grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 grid-flow-col items-start justify-center p-4 sm:p-6">
              {/* Progetti scolastici */}
              <Icon
                id="progetti_scolastici"
                title="Progetti Scolastici"
                srcIcon="/img/desktop/folder.png"
                size={80}
                className="text-white"
              >
                <div className="flex flex-wrap w-full items-start justify-start gap-4 text-[var(--dialog-text)]">
                  {/* Cartelle dei proggetti */}
                  {schoolProjects.map((school, index) => (
                    <Icon
                      key={`${school.id}-${index}`}
                      id={school.id}
                      title={school.title}
                      srcIcon="/img/desktop/folder.png"
                      size={80}
                      className="!text-[var(--dialog-text)] w-[80px]"
                    >
                      <div className="flex flex-row flex-wrap items-start gap-4">
                        <a
                          href={school.linkGithub}
                          className="flex flex-col items-center justify-start w-[80px] text-center h-[120px]"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GitHub Link"
                        >
                          <Image
                            src="/img/github.svg"
                            width={80}
                            height={80}
                            alt="github"
                            className="p-[6px]"
                          />
                          <p className="text-sm line-clamp-2 h-full">
                            GitHub Link
                          </p>
                        </a>
                        <Browser
                          id={school.title}
                          title={school.title}
                          srcBrowser={school.icon}
                          defaultUrl={school.linkWebsite}
                          size={80}
                        />
                        <Icon
                          id={school.idText}
                          title="readme"
                          srcIcon="/img/desktop/file_text.png"
                          size={80}
                        >
                          <textarea
                            value={school.textValue}
                            onChange={(e) => setAboutText(e.target.value)}
                            placeholder="Scrivi qualcosa..."
                            spellCheck={false}
                            className="w-full h-full text-[var(--dialog-text)] bg-transparent border-none outline-none resize-none text-sm"
                          />
                        </Icon>
                      </div>
                    </Icon>
                  ))}
                </div>
              </Icon>

              {/* Progetti in corso */}
              <Icon
                id="progetti_in_corso"
                title="Progetti in corso"
                srcIcon="/img/desktop/folder.png"
                size={80}
                className="text-white"
              >
                <div className="flex flex-wrap w-full items-start justify-start gap-4 text-[var(--dialog-text)]">
                  {continuedProject.map((soon) => (
                    <Icon
                      id={soon.id}
                      title={soon.title}
                      srcIcon="/img/desktop/folder.png"
                      size={80}
                      className="!text-[var(--dialog-text)] w-[80px]"
                      key={soon.title}
                    >
                      <div className="flex flex-row flex-wrap items-start gap-4">
                        <a
                          href={soon.linkGithub}
                          className="flex flex-col items-center justify-start w-[80px] text-center h-[120px]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/img/github.svg"
                            width={80}
                            height={80}
                            alt="github"
                            className="p-[6px]"
                          />
                          <p className="text-sm line-clamp-2 h-full">
                            GitHub Link
                          </p>
                        </a>
                        <Browser
                          id={soon.title}
                          title={soon.title}
                          srcBrowser={soon.icon}
                          defaultUrl={soon.linkWebsite}
                          size={80}
                        />
                      </div>
                    </Icon>
                  ))}
                </div>
              </Icon>

              {/* Progetti conclusi */}
              {/* <Icon
                id="progetti_conclusi"
                title="Progetti conclusi"
                srcIcon="/img/desktop/folder.png"
                size={80}
              >
                <p>Contenuto Progetti conclusi</p>
              </Icon> */}

              {/* Impostazioni */}
              <Icon
                id="settings"
                title="Impostazioni"
                srcIcon="/img/desktop/settings.png"
                size={80}
                className="text-white"
              >
                <div className="container mx-auto p-4 pt-0">
                  <p className="text-[var(--dialog-text)] text-xl font-bold text-center mb-4">
                    Impostazioni
                  </p>
                  <div className="flex flex-col items-center justify-center gap-4 w-full">
                    {/* Skip intro */}
                    <form
                      className="flex items-center justify-between w-full bg-[var(--dialog-bg-secondary)] py-4 px-4 rounded-md cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setSkipIntro(!skipIntro);
                      }}
                    >
                      <span className="text-[var(--dialog-text)] select-none">
                        Salta introduzione
                      </span>
                      <Switch
                        defaultSelected={skipIntro}
                        // isSelected={skipIntro}
                        onValueChange={setSkipIntro}
                        aria-label="Salta introduzione"
                      />
                    </form>

                    {/* Theme */}
                    <div className="flex items-center justify-between w-full bg-[var(--dialog-bg-secondary)] py-4 px-4 rounded-md">
                      <span className="text-[var(--dialog-text)] select-none">
                        Tema
                      </span>
                      <Select
                        className="w-1/3 colored-select"
                        // defaultSelectedKeys={[theme]}
                        selectedKeys={[theme]}
                        onSelectionChange={(keys) => {
                          const selectedTheme = Array.from(keys)[0] as Theme;
                          setTheme(selectedTheme);
                        }}
                        color="default"
                        radius="sm"
                      >
                        <SelectItem key="light">Light</SelectItem>
                        <SelectItem key="dark">Dark</SelectItem>
                        <SelectItem key="system">System</SelectItem>
                        <SelectItem key="mixed">Mixed</SelectItem>
                      </Select>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full bg-[var(--dialog-bg-secondary)] py-4 px-4 rounded-md">
                      <p className="text-[var(--dialog-text)] text-xl font-bold text-center mb-4">
                        Sfondi
                      </p>
                      <div className="flex justify-between items-center w-full gap-2">
                        {["1", "2", "3"].map((num) => (
                          <button
                            key={num}
                            onClick={() => setWallpaper(num as Wallpaper)}
                            className={`relative w-full aspect-video rounded-md overflow-hidden border-2 ${
                              wallpaper === num
                                ? "border-blue-500"
                                : "border-transparent"
                            }`}
                          >
                            <div className="min-w-[172px] min-h-[100px]">
                              <Image
                                src={`/img/wallpaper/wallpaper_${num}.jpg`}
                                alt={`Sfondo ${num}`}
                                fill
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Icon>

              {/* About me */}
              <Icon
                id="about_me"
                title="about_me.txt"
                srcIcon="/img/desktop/file_text.png"
                size={80}
                className="text-white"
              >
                <textarea
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Scrivi qualcosa..."
                  spellCheck={false}
                  className="w-full h-full text-[var(--dialog-text)] bg-transparent border-none outline-none resize-none text-sm"
                />
              </Icon>
            </div>

            {/* Barra dei menu */}
            <div className="max-h-[50px] h-full w-full bg-[var(--bg-barra)] border-t border-[var(--border-barra)]">
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

      {/* audio */}
      <audio src="/audio/button_in.mp3" id="clickIN" />
      <audio src="/audio/button_out.mp3" id="clickOUT" />
      <audio src="/audio/fan_pc.mp3" id="fanPC" />
      <audio src="/audio/start_os.mp3" id="startOS" />
    </>
  );
}
