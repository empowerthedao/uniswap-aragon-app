import React from "react"
import styled from 'styled-components'
import Option from "./Option";
import {Button, IdentityBadge} from "@aragon/ui";

const Settings = ({handleNewAgent, settings}) => {
    let {appAddress, agentAddress} = settings

    return (
        <SettingsContainer>
            <Option name="Agent Address"
                    text="The contract that represents an EOA and acts on behalf of the Compound app. Only send funds to this address via the transfer process provided.">
                <IdentityBadge
                    entity={agentAddress || '0x0000000000000000000000000000000000000000'}
                    shorten={false}
                />

                <ButtonContainer>
                    <Button mode="outline" onClick={() => handleNewAgent()}>
                        Change Agent
                    </Button>
                </ButtonContainer>
            </Option>

            <Option name="Uniswap App Address"
                    text="The contract address of this app. Do not send funds to this address.">
                <IdentityBadge
                    entity={appAddress || '0x0000000000000000000000000000000000000000'}
                    shorten={false}
                />
            </Option>

        </SettingsContainer>
    )
}

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    max-width: 400px;

`
const ButtonContainer = styled.div`
    margin-top: 20px;
    display: flex;
`

export default Settings