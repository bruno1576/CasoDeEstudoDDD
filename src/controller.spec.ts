describe('', () =>{
    test('', () => {
        expect(5).toBe(5)
    })

})

import React, { useCallback, useState } from "react";
import { DropzoneState, useDropzone } from "react-dropzone";
import styled, { css } from "styled-components";
import { CloseIcon } from "../icons/CloseIcon";
import { FileIcon } from "../icons/FileIcon";
import { UploadIcon } from "../icons/UploadIcon";

interface InputProps {
  dropzone: DropzoneState;
}

interface HasFileProps {
  file?: File;
  removeFile: () => void;
}

const Container = styled.div<{ isDragActive: boolean }>`
  width: 50%;
  height: 100%;
  border-radius: 0.375rem;
  border: 4px dashed;
  background-color: #4a5568;
  transition: all 0.3s ease-in-out;

  ${(props) => css`
    border-color: ${props.isDragActive ? "#4299e1" : "#2d3748"};
    &:hover {
      border-color: #4a5568;
      background-color: #2d3748;
    }
  `}
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 1.25rem;
  padding-bottom: 1.5rem;
  width: 100%;
  height: 100%;
`;

const Label = styled.label`
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

const Icon = styled(UploadIcon)<{ isDragActive: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 0.75rem;

  ${(props) => css`
    color: ${props.isDragActive ? "#4299e1" : "#cbd5e0"};
  `}
`;

const Text = styled.p<{ isDragActive: boolean }>`
  margin-bottom: ${(props) => (props.isDragActive ? "0" : "0.5rem")};
  font-size: ${(props) => (props.isDragActive ? "1rem" : "0.875rem")};
  font-weight: ${(props) => (props.isDragActive ? "bold" : "normal")};
  color: ${(props) => (props.isDragActive ? "#4299e1" : "#cbd5e0")};
`;

export const FileInput = () => {
  const [file, setFile] = useState<File | null>(null);

  const removeFile = useCallback(() => {
    setFile(null);
  }, [file]);

  const onDrop = useCallback((files: File[]) => {
    setFile(files[0]);
  }, []);

  const dropzone = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  if (file) return <HasFile file={file} removeFile={removeFile} />;

  return <Input dropzone={dropzone} />;
};

const FileContainer = styled.div`
  width: 50%;
  height: 100%;
  border-radius: 0.375rem;
  border: 4px dashed #2d3748;
  background-color: #4a5568;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FileContent = styled.div`
  background-color: #fff;
  width: 9rem;
  border-radius: 0.375rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`;

const HasFile = ({ file, removeFile }: HasFileProps) => {
  return (
    <FileContainer>
      <FileContent>
        <FileIcon className="w-5 h-5" />
        <span className="text-sm text-gray-500">{file?.name}</span>
        <button
          type="button"
          onClick={removeFile}
          className="place-self-start mt-1 p-1"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </FileContent>
    </FileContainer>
  );
};

const Input = ({ dropzone }: InputProps) => {
  const { getRootProps, getInputProps, isDragActive } = dropzone;

  return (
    <Container {...getRootProps()} isDragActive={isDragActive}>
      <Label htmlFor="dropzone-file">
        <CenteredContent>
          <Icon isDragActive={isDragActive} />
          {isDragActive ? (
            <Text isDragActive>Solte para adicionar</Text>
          ) : (
            <>
              <Text isDragActive={isDragActive}>
                Clique para enviar ou arraste até aqui
              </Text>
              <p className="text-gray-400 text-sm">PDF</p>
            </>
          )}
        </CenteredContent>
      </Label>
      <input {...getInputProps()} className="hidden" />
    </Container>
  );
};
