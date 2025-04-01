import React from 'react'

import { defaultOptions } from "./utils"
import Face from "./src/face"
import Hair from "./src/hair"
import Hat from "./src/hat"
import Eyes from "./src/eyes"
import Glasses from "./src/glasses"
import Ear from "./src/ear"
import Nose from "./src/nose"
import Mouth from "./src/mouth"
import Shirt from "./src/shirt"

import SectionWrapper from "./src/SectionWrapper/index"
import './index.css'
import Sex from './src/sex'
import { genConfig } from 'react-nice-avatar'

export default function AvatarEditor({ config = {
  "sex": "man",
  "faceColor": "#F9C9B6",
  "earSize": "small",
  "eyeStyle": "circle",
  "noseStyle": "round",
  "mouthStyle": "laugh",
  "shirtStyle": "hoody",
  "glassesStyle": "none",
  "hairColor": "#000",
  "hairStyle": "thick",
  "hatStyle": "none",
  "hatColor": "#FC909F",
  "eyeBrowStyle": "up",
  "shirtColor": "#FC909F",
  "bgColor": "linear-gradient(45deg, #3e1ccd 0%, #ff6871 100%)"
},
  updateConfig, setConfig }) {

  const genDefaultOptions = (opts) => {
    const hairSet = new Set(opts.hairStyleMan.concat(opts.hairStyleWoman))
    return {
      ...opts,
      hairStyle: Array.from(hairSet)
    }
  }

  const myDefaultOptions = genDefaultOptions(defaultOptions)

  const switchConfig = (type, currentOpt) => {
    const opts = myDefaultOptions[type]
    const currentIdx = opts.findIndex(item => item === currentOpt)
    const newIdx = (currentIdx + 1) % opts.length
    updateConfig(type, opts[newIdx])
  }

  return (
    <div className="AvatarEditor rounded-full px-3 py-2 flex items-center">
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Sex"
        switchConfig={() => switchConfig('sex', config.sex)}>
        <Sex sex={config.sex} />
      </SectionWrapper>
      {/* Face */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Face"
        switchConfig={() => switchConfig('faceColor', config.faceColor)}>
        <Face color={config.faceColor} />
      </SectionWrapper>
      {/* Hair style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Hair"
        switchConfig={() => switchConfig('hairStyle', config.hairStyle)}>
        <Hair style={config.hairStyle} color="#fff" colorRandom />
      </SectionWrapper>
      {/* Hat color */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Hair Color"
        switchConfig={() => switchConfig('hairColor', config.hairColor)}>
        <Hair style={config.hairStyle} color={config.hairColor} />
      </SectionWrapper>
      {/* Hat style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Hat"
        switchConfig={() => switchConfig('hatStyle', config.hatStyle)}>
        <Hat style={config.hatStyle} color="#fff" />
      </SectionWrapper>
      {/* Eyes style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Eyes"
        switchConfig={() => switchConfig('eyeStyle', config.eyeStyle)}>
        <Eyes style={config.eyeStyle} color="#fff" />
      </SectionWrapper>
      {/* Glasses style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Glasses"
        switchConfig={() => switchConfig('glassesStyle', config.glassesStyle)}>
        <Glasses style={config.glassesStyle} color="#fff" />
      </SectionWrapper>
      {/* Ear style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Ear"
        switchConfig={() => switchConfig('earSize', config.earSize)}>
        <Ear size={config.earSize} color="#fff" />
      </SectionWrapper>
      {/* Nose style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Nose"
        switchConfig={() => switchConfig('noseStyle', config.noseStyle)}>
        <Nose style={config.noseStyle} color="#fff" />
      </SectionWrapper>
      {/* Mouth style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Mouth"
        switchConfig={() => switchConfig('mouthStyle', config.mouthStyle)}>
        <Mouth style={config.mouthStyle} color="#fff" />
      </SectionWrapper>
      {/* Shirt style */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Shirt"
        switchConfig={() => switchConfig('shirtStyle', config.shirtStyle)}>
        <Shirt style={config.shirtStyle} color="#fff" />
      </SectionWrapper>
      {/* Shirt color */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Shirt Color"
        switchConfig={() => switchConfig('shirtColor', config.shirtColor)}
      >
        <Shirt style={config.shirtStyle} color={config.shirtColor} />
      </SectionWrapper>
      {/* Background color */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="BG"
        switchConfig={() => switchConfig('bgColor', config.bgColor)}
        bgColor={config.bgColor}
      >
      </SectionWrapper>
      {/* Random */}
      <SectionWrapper
        className="w-8 h-8 rounded-full p-2 mx-2"
        tip="Random"
        switchConfig={() => setConfig(genConfig({
          isGradient: Boolean(Math.round(Math.random())),
          sex: config.sex
        }))}
      >
        <Sex sex="?" />
      </SectionWrapper>
    </div>
  )
}
