import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

/**
 * WhatWeDoCard
 * - Exact recreation of the provided design using React + Tailwind + MUI
 * - All four options come from an array (default provided)
 * - On hover: option text turns white and arrow appears
 * - Six decorative assets positioned precisely with responsive tweaks
 *
 * Props:
 *  - items: [{ label: string, href?: string }]
 *  - assets: {
 *      bgTexture: string,          // subtle grain / scratches
 *      leftStrip: string,          // vertical fabric strip
 *      squiggleTopLeft: string,    // blue curly at top-left
 *      squiggleArrowTrail: string, // blue curved arrow in the middle
 *      dottedBallLeft: string,     // blue dotted sphere near center-left
 *      dottedBallRight: string,    // blue dotted sphere bottom-right
 *      burst: string               // star-burst behind header arrow
 *    }
 */
export default function See({
  items = [
    { label: "Product Design" },
    { label: "Ideation & Strategy" },
    { label: "Web and Mobile" },
    { label: "Embedded Systems" },
    { label: "Hardware Prototyping" },
  ],
  assets,
  onTitleClick,
}) {
  const {
    bgTexture = "",
    leftStrip = "",
    squiggleTopLeft = "",
    squiggleArrowTrail = "",
    dottedBallLeft = "",
    dottedBallRight = "",
    burst = "",
  } = assets || {};

  return (
    <section
      className="
        relative  overflow-hidden w-[90%] mx-[5%]
        bg-[#232323] text-white
        my-[5%]
      "
      style={{
        // Background texture
        backgroundImage: bgTexture ? `url(${bgTexture})` : undefined,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Absolute decorative layers (6) */}
      {/* 1) Top-left squiggle */}
        <img
          src={"/home-see/img1.png"}
          alt=""
          className="
            pointer-events-none select-none
            absolute top-5 left-2 w-28 md:w-40
          "
          draggable="false"
        />

      {/* 2) Vertical fabric strip (left) */}
      
        <img
          src={"/home-see/img2.png"}
          alt=""
          className="
            pointer-events-none select-none
            absolute top-0 left-[18.5rem] h-full w-[4rem]
            hidden md:block opacity-20
          "
          style={{ objectFit: "cover" }}
          draggable="false"
        />

      {/* 3) Curved arrow trail (middle-right) */}
     
        <img
          src={"/home-see/img4.png"}
          alt=""
          className="
            pointer-events-none select-none
            absolute top-[36%] right-[45%] w-36 md:w-56
          "
          draggable="false"
        />

      {/* 4) Dotted ball (left-bottom/center) */}
     
        <img
          src={"/home-see/img3.png"}
          alt=""
          className="
            pointer-events-none select-none
            absolute bottom-6 left-[30%] w-16 md:w-20
          "
          draggable="false"
        />
      

      {/* 5) Dotted ball (bottom-right) */}
      
        <img
          src={"/home-see/img6.png"}
          alt=""
          className="
            pointer-events-none select-none
            absolute bottom-5 right-6 w-12 md:w-16
          "
          draggable="false"
        />
      

      {/* 6) Burst behind header arrow */}
     
        <img
          src={"/home-see/img5.png"}
          alt=""
          className="
            pointer-events-none select-none
            absolute top-8 right-8 w-10 md:w-12
          "
          draggable="false"
        />
     

      {/* Content grid (responsive) */}
      <div
        className="
          relative z-[1] grid
          grid-cols-1 md:grid-cols-2
        "
      >
        {/* LEFT: Headline */}
        <div
          className="
            relative flex items-center md:items-start
            px-6 py-10 md:py-16 md:pl-10 md:pr-8
        
          "
        >
          <h2
            className="
              font-medium leading-[1.08]
              text-[34px] md:text-[56px] tracking-[0.2px]
            "
            style={{ color: "#F0F0F0" }}
          >
            See what
            <br /> we can do
            <br /> for you
          </h2>
        </div>

        {/* RIGHT: Title + menu */}
        <div
          className="
            relative px-6 py-6 md:py-4 md:pr-10 md:pl-12
            border-t md:border-t-0 md:border-l border-white/10
          "
        >
          {/* Title row (Product Design + fixed blue arrow) */}
          {/* <div className="flex items-center justify-between">
            <div
              className="
                text-[28px] md:text-[34px] font-medium
                text-white
              "
            >
              Product Design
            </div>

            {/* Fixed circular button (matches design) */}
            {/* <div className="relative"> */}
              {/* burst sits behind via absolute above */}
              {/* <IconButton
                onClick={onTitleClick}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "#1463FF",
                  "&:hover": { bgcolor: "#0F50CC" },
                }}
              >
                <ArrowForwardRoundedIcon sx={{ color: "#fff" }} />
              </IconButton>
            </div>
          </div> */} 

          {/* Divider under title */}
          {/* <div className="mt-4 h-px w-full bg-white/10" /> */}

          {/* Options list (4 items from array) */}
          <nav className="mt-1">
            <ul className="divide-y divide-white/10">
              {items.map((item, idx) => (
                <li key={`${item.label}-${idx} hover:scale-120`}>
                  <a
                    href={item.href || "#"}
                    className="
                      group flex items-center justify-between
                      py-2 md:py-5
                    "
                  >
                    {/* Label */}
                    <span
                      className="
                        text-[18px] md:text-[22px]
                        transition-all duration-150
                        text-white/60 group-hover:text-white
                        group-hover:scale-110
                      "
                    >
                      {item.label}
                    </span>

                    {/* Hover arrow (hidden by default) */}
                    <span
                      className="
                        pointer-events-none
                        opacity-0 translate-x-[-6px]
                        group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-150 ease-out
                        inline-flex items-center justify-center
                        rounded-full border border-blue-800 bg-blue-800
                        group-hover: scale-110
                        w-9 h-9
                      "
                      aria-hidden="true"
                    >
                      <ArrowForwardRoundedIcon
                        sx={{ width: 20, height: 20, color: "#ffffff", }}
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

// WhatWeDoCard.propTypes = {
//   items: PropTypes.arrayOf(
//     PropTypes.shape({
//       label: PropTypes.string.isRequired,
//       href: PropTypes.string,
//     })
//   ),
//   assets: PropTypes.shape({
//     bgTexture: PropTypes.string,
//     leftStrip: PropTypes.string,
//     squiggleTopLeft: PropTypes.string,
//     squiggleArrowTrail: PropTypes.string,
//     dottedBallLeft: PropTypes.string,
//     dottedBallRight: PropTypes.string,
//     burst: PropTypes.string,
//   }),
//   onTitleClick: PropTypes.func,
// };
