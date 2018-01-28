import { IMidiFile } from "midi-json-parser-worker";
import * as React from "react";

export interface IMidiFilesProps {
  children: React.ReactChild | React.ReactChild[];
}

export type FileDropHandler = (files: ArrayBuffer[]) => void;

export interface IHandlers {
  onFileDrop: FileDropHandler;
}

export interface IMidiFilesProp {
  midiFiles: IMidiFile[];
}

interface IState {
  setMidiFiles: (files: IMidiFile[]) => void;
}

export type State = IState & IMidiFilesProp;

export type AppProps = IHandlers & State & IMidiFilesProps;

export type WithChildrenHandler = (props: IMidiFilesProp) => IMidiFilesProps;
