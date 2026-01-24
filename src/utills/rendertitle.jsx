import React from "react";
const renderTitle = (fullTitle) => {
    if (!fullTitle) return <span className="text-[#002b80]">About Us</span>;
    
    const words = fullTitle.split(" ");
    return (
      <>
        <span className="text-[#002b80]">{words[0]}</span>{" "}
        <span className="text-blue-400 font-medium">{words[1]}</span>{" "}
        <span className="text-[#002b80]">{words.slice(2).join(" ")}</span>
      </>
    );
  };


  export default renderTitle