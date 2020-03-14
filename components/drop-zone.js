import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import BlobAnimation from './blob-animation';

function DropZone({ dropAction }) {
  const onDrop = useCallback((acceptedFiles) => {
    dropAction(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="drop-zone flex just-center align-center">
      <input {...getInputProps()} />
      {!isDragActive ? (
        <div className="drop-zone-content">
          <p className="primary-text">Drop</p>
          <p className="secondary-text">
            your files here, or
            {' '}
            <span className="underline">browse</span>
          </p>
        </div>
      )
        : <BlobAnimation show={isDragActive} />}
      <style>
        {
        `
        .drop-zone{
          width:-webkit-fill-available;
          height:-webkit-fill-available;
          cursor:pointer;
          outline:none;
          text-align:center;
        }

        .drop-zone-content{
          transition:all 1000ms ease;
        }

        .primary-text{
          color:var(--primary-color);
          font-size:25px;
          margin:10px 0px;
        }

        .secondary-text{
          color:var(--secondary-color);
          font-size:14px;
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
