import React from "react"
import styled from 'styled-components'
import Option from "./Option";
import {Button, IdentityBadge} from "@aragon/ui";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const Settings = ({handleNewAgent, settings, compactMode}) => {
    let {agentAddress} = settings

    return (
        <SettingsContainer>
            <Option name="Agent Address"
                    text="The contract that represents an EOA (Externally Owned Account) and acts on behalf of the Compound app. Only send funds to this address via the transfer process provided.">
                <IdentityBadge
                    entity={agentAddress || ZERO_ADDRESS}
                    shorten={compactMode}
                />

                <ButtonContainer>
                    <Button mode="outline" onClick={() => handleNewAgent()}>
                        Change Agent
                    </Button>
                </ButtonContainer>
            </Option>
        </SettingsContainer>
    )
}

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    max-width: 400px;
    margin: 30px 30px;

`
const ButtonContainer = styled.div`
    margin-top: 25px;
    display: flex;
`

export default Settings