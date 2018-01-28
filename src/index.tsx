import { IMidiFile } from "midi-json-parser-worker";
import * as Types from "./types";

import { parseArrayBuffer } from "midi-json-parser";
import * as React from "react";
import { render } from "react-dom";
import DropToUpload from "react-drop-to-upload";
import ReactJson from "react-json-view";
import { branch, compose, renderComponent, withHandlers,
  withProps, withState } from "recompose";
import styled from "styled-components";

const Layout = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-height: 100%;
`;

const App: React.SFC<
  Types.AppProps
> = ({children, onFileDrop, midiFiles}) => (
  <DropToUpload
    onDropArrayBuffer={onFileDrop}
  >
    <Layout>
      {children}
    </Layout>
  </DropToUpload>
);

const renderMidiFiles = (midiFiles: IMidiFile[]) => (
  midiFiles.map((file, idx) => (
    <ReactJson key={idx} src={file} />
  ))
);

const withFileState = withState<
  undefined,
  IMidiFile[],
  "midiFiles",
  "setMidiFiles"
>("midiFiles", "setMidiFiles", []);

const withEventHandlers = withHandlers<Types.State, Types.IHandlers>({
  onFileDrop: ({setMidiFiles}): Types.FileDropHandler => (files) => (
    Promise.all(files.map(parseArrayBuffer)).then(setMidiFiles)
  ),
});

const withChildrenProp = (handler: Types.WithChildrenHandler) => (
  withProps<
    Types.IMidiFilesProps,
    Types.IMidiFilesProp
  >(handler)
);

const withNoMidiFilesChildren = withChildrenProp((props) => ({
  children: <p>Drop MIDI file(s) here</p>,
}));

const withMidiFilesChildren = withChildrenProp((props) => ({
  children: renderMidiFiles(props.midiFiles),
}));

const branchMidiFilesChildren = branch<Types.IMidiFilesProp>(
  ({ midiFiles }) => midiFiles.length === 0,
  withNoMidiFilesChildren,
  withMidiFilesChildren,
);

const AppContainer = compose(
  withFileState,
  withEventHandlers,
  branchMidiFilesChildren,
)(App);

render(<AppContainer />, document.getElementById("root"));
