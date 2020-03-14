import React, { useEffect, useState } from 'react';

const BlobAnimation = (props) => {
  const { show } = props;
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    setDisplay(show ? 'active' : '');
  }, [show]);

  return (
    <div>
      <img className={`blob-base blob-small  ${display}`} src="/blob-1.svg" alt="" />
      <img className={`blob-base blob-medium  ${display}`} src="/blob-2.svg" alt="" />
      <img className={`blob-base blob-large  ${display}`} src="/blob-3.svg" alt="" />
      <img className={`blob-base blob-medium  ${display}`} src="/blob-4.svg" alt="" />
      <img className={`blob-base blob-large  ${display}`} src="/blob-5.svg" alt="" />

      <style>
        {
      `
        .blob-base{
          position:absolute;
          top:50%;
          left:50%;
          opacity:0;
          transform:translate(-50%,-50%);
          transition:opacity 250ms ease-in;
          margin:-60px 0 0 -60px;
        }

        .blob-base.active{
          opacity:0.12;
        }

        .blob-small{
          height:250px;
          width:250px;
          animation:move 4s linear infinite;
        }

        .blob-medium{
          height:350px;
          width:350px;
          animation:move 4s linear infinite;
        }

        .blob-large{
          height:450px;
          width:450px;
          animation:move 4s linear infinite;
        }

        @keyframes move {
          0%   { transform: scale(1)   translate(-50%, -50%); }
          38%  { transform: scale(0.9, 1) translate(-50%, -50%) ; }
          40%  { transform: scale(0.9, 1) translate(-50%, -50%) ; }
          78%  { transform: scale(1) translate(-50%, -50%) ; }
          80%  { transform: scale(1) translate(-50%, -50%) ; }
          100% { transform: scale(1)   translate(-50%, -50%); }
        }

        
      `
    }

      </style>

    </div>
  );
};

export default BlobAnimation;
