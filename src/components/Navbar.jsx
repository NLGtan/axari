import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";

const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);
  const lastScrollYRef = useRef(0); // track scroll without causing re-renders

  // NAVBAR SHOW/HIDE ON SCROLL
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY === 0) {
        setIsNavVisible(true);
        navContainerRef.current.classList.remove("floating-nav");
      } else if (currentY > lastScrollYRef.current) {
        setIsNavVisible(false);
        navContainerRef.current.classList.add("floating-nav");
      } else if (currentY < lastScrollYRef.current) {
        setIsNavVisible(true);
        navContainerRef.current.classList.add("floating-nav");
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // GSAP NAVBAR ANIMATION
  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // TOGGLE AUDIO MANUALLY
  const toggleAudioIndicator = () => {
    if (!audioElementRef.current) return;
    if (isAudioPlaying) {
      audioElementRef.current.pause();
    } else {
      audioElementRef.current.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
    setIsIndicatorActive(!isIndicatorActive);
  };

  // AUTO-PLAY AUDIO ON FIRST USER INTERACTION
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    let hasPlayed = false;

    const playAudioWithFade = async () => {
      if (hasPlayed) return;
      hasPlayed = true;

      try {
        audio.volume = 0.01;
        await audio.play();
        audio.muted = false;

        setIsAudioPlaying(true);
        setIsIndicatorActive(true);

        let volume = 0.01;
        const fadeInterval = setInterval(() => {
          if (volume < 1) {
            volume += 0.02;
            audio.volume = Math.min(volume, 1);
          } else {
            clearInterval(fadeInterval);
          }
        }, 100);
      } catch (error) {
        console.log("Audio play failed:", error);
      }
    };

    const handleInteraction = () => {
      playAudioWithFade();
      // Remove listeners after first interaction
      document.removeEventListener("click", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    window.addEventListener("wheel", handleInteraction);
    window.addEventListener("pointerdown", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-18" />
            <Button
              id="product-button"
              title="Products"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="relative ms-10 font-general text-xs uppercase text-blue-50 after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-800 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100 dark:after:bg-white cursor-pointer"
                >
                  {item}
                </a>
              ))}
            </div>

            <button className="ml-10 flex items-center space-x-0.5" onClick={toggleAudioIndicator}>
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop2.MP3"
                muted
                playsInline
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`indicator-line ${isIndicatorActive ? "active" : ""}`}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
