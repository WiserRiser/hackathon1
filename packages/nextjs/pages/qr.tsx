//Based on https://codesandbox.io/s/generate-qrcode-with-json-data-forked-p9f823?file=/index.js:0-786
import React from "react";
import { render } from "react-dom";
import { QRCode } from "react-qr-svg";
import { data } from "../components/qrValueProofRequestExample";

const styles = {
  root: {
    fontFamily: "sans-serif"
  },
  h1: {
    textAlign: "center"
  },
  qrcode: {
    display:"flex",
  }
} as const;

export default class App extends React.Component {
  render() {
    return (
      <div style={styles.root}>
        <h1 style={styles.h1}>QRCode with JSON</h1>
        <div style={styles.qrcode} className="flex justify-center items-center">
          <QRCode
            level="Q"
            style={{ height: "750px" }}
            value={JSON.stringify(data)}
          />
        </div>
      </div>
    );
  }
}
