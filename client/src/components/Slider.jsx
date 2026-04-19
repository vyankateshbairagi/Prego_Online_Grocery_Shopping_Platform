import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Slider = () => {
  const { t } = useAppContext();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide data
  const slides = [
    {
      image: assets.Slider_image1,
      headline: t("slider.headline1"),
      subheadline: t("slider.subheadline1"),
      cta: t("slider.cta1"),
      link: "/products/fruits",
    },
    {
      image: assets.Slider_image2,
      headline: t("slider.headline2"),
      subheadline: t("slider.subheadline2"),
      cta: t("slider.cta2"),
      link: "/products/dairy",
    },
    {
      image: assets.Slider_image3,
      headline: t("slider.headline3"),
      subheadline: t("slider.subheadline3"),
      cta: t("slider.cta3"),
      link: "/products/snacks",
    },
    {
      image: assets.Slider_image4,
      headline: t("slider.headline4"),
      subheadline: t("slider.subheadline4"),
      cta: t("slider.cta4"),
      link: "/products/bakery",
    },
    {
      image: assets.Slider_image5,
      headline: t("slider.headline5"),
      subheadline: t("slider.subheadline5"),
      cta: t("slider.cta5"),
      link: "/health-picks",
    },
  ];

  const totalSlides = slides.length;

  /** Go to specific slide */
  const goToSlide = (index) => {
    if (!sliderRef.current) return;
    const slideWidth = sliderRef.current.children[0].clientWidth;
    sliderRef.current.style.transform = `translateX(-${index * slideWidth}px)`;
    setCurrentSlide(index);
  };

  /** Next / Previous */
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  /** Autoplay */
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  /** Update slide when currentSlide changes */
  useEffect(() => {
    goToSlide(currentSlide);
  }, [currentSlide]);

  /** Handle resize */
  useEffect(() => {
    const handleResize = () => goToSlide(currentSlide);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide]);

  /** Touch swipe support */
  useEffect(() => {
    let startX = 0;
    let endX = 0;
    const slider = sliderRef.current;

    const handleTouchStart = (e) => (startX = e.touches[0].clientX);
    const handleTouchMove = (e) => (endX = e.touches[0].clientX);
    const handleTouchEnd = () => {
      if (startX - endX > 50) nextSlide();
      if (endX - startX > 50) prevSlide();
    };

    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener("touchend", handleTouchEnd);

    return () => {
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
      slider.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden mt-5 sm:mt-8 rounded-xl sm:rounded-2xl shadow-lg">
      {/* Slider */}
      <div className="w-full relative">
        <div
          ref={sliderRef}
          className="flex w-full transition-transform duration-500 ease-in-out"
        >
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.image}
              alt={slide.headline}
              className={`w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px] object-cover flex-shrink-0 transition-transform duration-700 ${currentSlide === index
                ? "scale-105 opacity-100"
                : "scale-100 opacity-70"
                }`}
            />
          ))}
        </div>

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

        {/* Slide content */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-center z-20 w-[92%] sm:w-[80%] md:w-[70%] max-w-3xl px-2 sm:px-4">
          <h1 className="text-base leading-tight sm:text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-1.5 sm:mb-2 line-clamp-2 sm:line-clamp-none">
            {slides[currentSlide].headline}
          </h1>
          <p className="text-xs sm:text-base md:text-xl text-white/90 font-medium mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-none">
            {slides[currentSlide].subheadline}
          </p>
          <a
            href={slides[currentSlide].link}
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2 sm:px-8 sm:py-4 text-xs sm:text-base rounded-full shadow-md transition-all duration-300"
          >
            {slides[currentSlide].cta}
          </a>
        </div>

      </div>


      {/* Prev button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 bg-black/40 rounded-full hover:bg-black/60"
        aria-label={t("slider.previous")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-6 sm:w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 bg-black/40 rounded-full hover:bg-black/60"
        aria-label={t("slider.next")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-6 sm:w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>


      {/* Pagination dots */}
      {/*<div className="absolute bottom-4 w-full flex justify-center gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${currentSlide === index ? "bg-white scale-125" : "bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>*/}
    </div>
  );
};

export default Slider;
