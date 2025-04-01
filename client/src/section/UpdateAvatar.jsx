import React, { useState } from 'react'
import AvatarEditor from './AvatorEditor'

import ReactNiceAvatar, { genConfig } from 'react-nice-avatar'
import './UpdateAvatar.css'
import deepCopy from '../utils/deepcopy'

export default function UpdateAvatar({defaultConfig, setUpdatedConfig}) {

  const [config, setConfig] = useState(defaultConfig ? defaultConfig : genConfig({
    isGradient: Boolean(Math.round(Math.random()))
  }))

  const updateConfig = (config, setConfig) => (key, value) => {
    const new_config = deepCopy(config)
    new_config[key] = value
    setConfig(new_config)
    setUpdatedConfig(new_config)
  }

  const avatarId = "myAvatar"

  return (
    <>
      <div className="App flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center">
          <div
            id={avatarId}
            className="mb-10">
            <ReactNiceAvatar
              className="w-64 h-64 highres:w-80 highres:h-80"
              hairColorRandom
              {...config} />
          </div>
          <AvatarEditor
            config={config}
            updateConfig={updateConfig(config, setConfig)}
            setConfig={setConfig}
          />
        </main>
      </div>
    </>
  )
}
