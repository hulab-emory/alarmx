import React from 'react'

export default function Sex(props) {
  const { sex } = props;
  return (
    <div
      style={{
        position: "absolute",
        // bottom: "-2.5%",
        width: "100%",
        height: "100%",
        lineHeight: "200%",
        textAlign: "center",
        alignSelf: "center",
        fontWeight: "bold",
        color: "white",
        userSelect: "none",
      }}
    >
      {sex[0].toUpperCase()}
    </div>
  )
}
