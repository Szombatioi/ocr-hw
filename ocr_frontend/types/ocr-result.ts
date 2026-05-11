export interface OcrResult {
  ParsedResults: ParsedResult[]
  OCRExitCode: number
  IsErroredOnProcessing: boolean
  ProcessingTimeInMilliseconds: string
  SearchablePDFURL: string
}

export interface ParsedResult {
  TextOverlay: TextOverlay
  TextOrientation: string
  FileParseExitCode: number
  ParsedText: string
  ErrorMessage: string
  ErrorDetails: string
}

export interface TextOverlay {
  Lines: Line[]
  HasOverlay: boolean
  Message: string
}

export interface Line {
  LineText: string
  Words: Word[]
  MaxHeight: number
  MinTop: number
}

export interface Word {
  WordText: string
  Left: number
  Top: number
  Height: number
  Width: number
}
