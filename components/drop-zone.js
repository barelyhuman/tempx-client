import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function DropZone({ dropAction }) {
  const onDrop = useCallback((acceptedFiles) => {
    dropAction(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="drop-zone">
      <input {...getInputProps()} />
      <div>
        <p className="primary-text">Drop</p>
        <p className="secondary-text">
          your files here, or
          {' '}
          <span className="underline">browse</span>
        </p>
      </div>
      <style>
        {
        `
        .drop-zone{
          width:100%;
          cursor:pointer;
          outline:none;
          text-align:center;
        }

        .primary-text{
          color:#595EF2;
          font-size:18px;
          margin:10px 0px;
        }

        .secondary-text{
          color:#A1AAD0;
          font-size:12px;
        }

        .underline{
          text-decoration:underline;
        }
        

        `
      }

      </style>
    </div>
  );
}

export default DropZone;
