import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function DropZone({ dropAction }) {
  const onDrop = useCallback((acceptedFiles) => {
    dropAction(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="border-bottom padding-25-px">
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p>Drop the files here ...</p>
          : <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      }
    </div>
  );
}

export default DropZone;
