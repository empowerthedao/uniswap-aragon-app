import React from 'react'
import ReactDOM from 'react-dom'
import {AragonApi} from '@aragon/api-react'
import App from './App'
import reducer from "./app-state-reducer";

ReactDOM.render(
    <AragonApi reducer={reducer}>
        <App/>
    </AragonApi>,
    document.getElementById('root')
)
