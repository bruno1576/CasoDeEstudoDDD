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


//testee
import express, { Request, Response } from "express";
import multer from "multer";
import xlsx from "xlsx";

const app = express();
const port = 3000;

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Função para verificar se as colunas A, B, C e D existem em uma folha do Excel
function verificaColunas(sheet: xlsx.WorkSheet): boolean {
  const requiredColumns = ["A", "B", "C", "D"];

  for (const col of requiredColumns) {
    if (!sheet[col + "1"]) {
      return false;
    }
  }

  return true;
}

app.post(
  "/upload",
  upload.single("excelFile"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).send("Nenhum arquivo enviado.");
      }

      // Verifique se req.file.originalname existe antes de acessá-lo
      const fileName = req.file.originalname || "Desconhecido";

      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];

        // Verifique se as colunas A, B, C e D existem na folha do Excel
        if (verificaColunas(sheet)) {
          console.log(
            `O arquivo ${fileName} possui as colunas A, B, C e D na folha ${sheetName}.`
          );
        } else {
          console.log(
            `O arquivo ${fileName} não possui todas as colunas A, B, C e D na folha ${sheetName}.`
          );
        }

        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        console.log(`Conteúdo da folha ${sheetName}:`);
        console.log(data);
      });

      return res.status(200).send("Arquivo processado com sucesso.");
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
      return res.status(500).send("Erro interno do servidor.");
    }
  }
);

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
///////////

import express, { Request, Response } from "express";
import multer from "multer";
import xlsx from "xlsx";
import * as fs from "fs";
import path from "path";

const app = express();
const port = 3000;

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Função para verificar se as colunas A, B, C e D existem em uma folha do Excel
function verificaColunas(sheet: xlsx.WorkSheet): boolean {
  const requiredColumns = ["A", "B", "C", "D"];

  for (const col of requiredColumns) {
    if (!sheet[col + "1"]) {
      return false;
    }
  }

  return true;
}

app.post(
  "/upload",
  upload.single("excelFile"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).send("Nenhum arquivo enviado.");
      }

      // Verifique se req.file.originalname existe antes de acessá-lo
      const fileName = req.file.originalname || "Desconhecido";

      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];

        // Verifique se as colunas A, B, C e D existem na folha do Excel
        if (verificaColunas(sheet)) {
          console.log(
            `O arquivo ${fileName} possui as colunas A, B, C e D na folha ${sheetName}.`
          );
        } else {
          console.log(
            `O arquivo ${fileName} não possui todas as colunas A, B, C e D na folha ${sheetName}.`
          );
        }

        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        console.log(`Conteúdo da folha ${sheetName}:`);
        console.log(data);
      });

      return res.status(200).send("Arquivo processado com sucesso.");
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
      return res.status(500).send("Erro interno do servidor.");
    }
  }
);

app.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "../planilha.xlsx");

  // Verifica se o arquivo existe
  if (fs.existsSync(filePath)) {
    // Define o tipo de conteúdo como Excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    // Define o cabeçalho de resposta para download
    res.setHeader("Content-Disposition", "attachment; filename=planilha.xlsx");

    // Lê o arquivo e envia como resposta
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // Se o arquivo não existir, retorna um erro 404
    res.status(404).send("File not found");
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});

