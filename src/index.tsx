import { parseArrayBuffer } from "midi-json-parser";
import { IMidiFile } from "midi-json-parser-worker";
import * as React from "react";
import { render } from "react-dom";
import DropToUpload from "react-drop-to-upload";
import ReactJson from "react-json-view";
import { compose, withHandlers, withState } from "recompose";
import styled from "styled-components";

type FileDropHandler = (files: ArrayBuffer[]) => void;

interface IHandlers {
  onFileDrop: FileDropHandler;
}

interface IState {
  midiFiles: IMidiFile[];
  setMidiFiles: (files: IMidiFile[]) => void;
}

type MidiDebugProps = IHandlers & IState;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-height: 100%;
`;

const withFileState = withState<
  undefined,
  IMidiFile[],
  "midiFiles",
  "setMidiFiles"
>("midiFiles", "setMidiFiles", []);

const withEventHandlers = withHandlers<IState, IHandlers>({
  onFileDrop: ({setMidiFiles}): FileDropHandler => (files) => (
    Promise.all(files.map(parseArrayBuffer)).then(setMidiFiles)
  ),
});

const renderMidiFiles = (midiFiles: IMidiFile[]) => (
  midiFiles.map((file, idx) => (
    <ReactJson key={idx} src={file} />
  ))
);

const MidiDebug: React.SFC<MidiDebugProps> = ({onFileDrop, midiFiles}) => (
  <DropToUpload
    onDropArrayBuffer={onFileDrop}
  >
    <Layout>
      {renderMidiFiles(midiFiles)}
    </Layout>
  </DropToUpload>
);

const MidiDebugContainer = compose(
  withFileState,
  withEventHandlers,
)(MidiDebug);

render(<MidiDebugContainer />, document.getElementById("root"));
