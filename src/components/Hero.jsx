import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import { useGSAP } from "@gsap/react";
import Lottie from "lottie-react";
import customLoader from "./animation/loading circle.json";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const currentVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const upcomingVideoRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const upcomingVideo = (currentIndex % totalVideos) + 1;

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideo);
  };

  useEffect(() => {
    if (loadedVideos >= 3) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVideoRef.current.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  const [currentWord, setCurrentWord] = useState("REVOLUTIONIZE");
  const [gamingWord, setGamingWord] = useState(
    <>
      G<b>A</b>MING
    </>
  );

  const words = [
    <>
      RE<b>V</b>OLUTIONI<b>Z</b>E
    </>, // English
    <>
      革<b>命</b>を起こす
    </>, // Japanese
    <>
      RE<b>V</b>OLUTIONI<b>Z</b>E
    </>, // English
    <>
      革<b>命</b>性
    </>, // Chinese
    <>
      RE<b>V</b>OLUTIONI<b>Z</b>E
    </>, // English
    <>
      혁<b>신</b>하다
    </>, // Korean
  ];

  const gamingWords = [
    <>
      G<b>A</b>MING
    </>, // English
    <>
      ゲ<b>ー</b>ミング
    </>, // Japanese
    <>
      G<b>A</b>MING
    </>,
    <>
      游<b>戏</b>中
    </>, // Chinese
    <>
      G<b>A</b>MING
    </>,
    <>
      게<b>이</b>밍
    </>, // Korean
  ];

  useGSAP(() => {
    let heroIndex = 0;
    let gamingIndex = 0;

    const glitch = (
      id,
      setWord,
      wordsArray,
      xSkew = 10,
      duration = 0.05,
      hueRotate = 90
    ) => {
      const tl = gsap.timeline();
      tl.to(`#${id}`, {
        duration: duration,
        x: xSkew,
        skewX: xSkew,
        opacity: 0.7,
        filter: "contrast(200%) brightness(150%)",
        ease: "power4.inOut",
      })
        .to(`#${id}`, {
          duration: duration,
          x: -xSkew,
          skewX: -xSkew,
          opacity: 0.4,
          filter: `hue-rotate(${hueRotate}deg)`,
          ease: "power4.inOut",
        })
        .to(`#${id}`, {
          duration: duration,
          x: 0,
          skewX: 0,
          opacity: 1,
          filter: "none",
          onComplete: () => {
            if (id === "hero-word") {
              setWord(wordsArray[heroIndex]);
            } else {
              setWord(wordsArray[gamingIndex]);
            }
          },
        });
      return tl;
    };

    gsap.to(
      {},
      {
        repeat: -1,
        repeatDelay: 1.2,
        onRepeat: () => {
          // Update indices
          heroIndex = (heroIndex + 1) % words.length;
          gamingIndex = (gamingIndex + 1) % gamingWords.length;

          // Trigger glitch animations
          glitch("hero-word", setCurrentWord, words, 10, 0.05, 90);
          glitch("gaming-word", setGamingWord, gamingWords, 15, 0.04, 80);
        },
      }
    );
  }, []);

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* Loader */}
      {isLoading && (
        <div className="flex-center absolute z-100 h-dvh w-full overflow-hidden bg-violet-50">
          <Lottie
            animationData={customLoader}
            loop={true}
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div
              onClick={handleMiniVdClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={upcomingVideoRef}
                src={getVideoSrc(upcomingVideo)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />

          <video
            ref={currentVideoRef}
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        <h1
          id="gaming-word"
          className="special-font uppercase font-zentry font-black text-5xl sm:right-10 sm:text-7xl md:text-9xl lg:text-[12rem] absolute bottom-5 right-5 z-40 text-blue-75"
        >
          {gamingWord}
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1
              id="hero-word"
              className="special-font uppercase font-zentry font-black text-5xl sm:right-10 sm:text-7xl md:text-9xl lg:text-[12rem] text-blue-100"
            >
              {currentWord}
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              title="Watch trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="!bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      <h1
        id="gaming-word"
        className="special-font uppercase font-zentry font-black text-5xl sm:right-10 sm:text-7xl md:text-9xl lg:text-[12rem] absolute bottom-5 right-5 text-black"
      >
        {gamingWord}
      </h1>
    </div>
  );
};

export default Hero;
