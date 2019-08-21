import React from 'react'
import ReactDOM from 'react-dom'
import {AragonApi} from '@aragon/api-react'
import {Main} from '@aragon/ui'
import App from './App'
import reducer from "./app-state-reducer";

ReactDOM.render(
    <AragonApi reducer={reducer}>
        <Main>
            <App/>
        </Main>
    </AragonApi>,
    document.getElementById('root')
)
