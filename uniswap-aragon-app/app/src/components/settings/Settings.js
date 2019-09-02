import React from "react"
import styled from 'styled-components'
import {Box, Button, IdentityBadge, Text, Info} from "@aragon/ui";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const Settings = ({handleNewAgent, handleNewUniswapFactory, settings, compactMode}) => {
    let {agentAddress, uniswapFactoryAddress} = settings

    return (
        <SettingsContainer>

            <Box heading={"Agent Address"}>

                <div css={`display: flex; flex-direction: column;`}>
                    <Text>
                        The contract that represents an EOA (Externally Owned Account) and acts on behalf of the
                        Compound app.
                    </Text>

                    <MarginTopContainer>
                        <IdentityBadge
                            entity={agentAddress || ZERO_ADDRESS}
                            shorten={compactMode}
                        />
                    </MarginTopContainer>

                    <MarginTopContainer>
                        <Info>
                            <strong>
                                Only send funds to this address via the transfer process provided.
                            </strong>
                        </Info>
                    </MarginTopContainer>

                    <ButtonContainer>
                        <Button mode="outline" onClick={() => handleNewAgent()}>
                            Change Agent
                        </Button>
                    </ButtonContainer>
                </div>
            </Box>

            <Box heading={"Uniswap Factory Address"}>
                <div css={`display: flex; flex-direction: column;`}>
                    <Text>
                        The contract that maintains the addresses of the individual Uniswap token exchanges.
                    </Text>

                    <MarginTopContainer>
                        <IdentityBadge
                            entity={uniswapFactoryAddress || ZERO_ADDRESS}
                            shorten={compactMode}
                        />
                    </MarginTopContainer>

                    {/*<MarginTopContainer>*/}
                    {/*    <Info mode="warning">*/}
                    {/*        <strong >*/}
                    {/*            Never send funds to this address.*/}
                    {/*        </strong>*/}
                    {/*    </Info>*/}
                    {/*</MarginTopContainer>*/}

                    <ButtonContainer>
                        <Button mode="outline" onClick={() => handleNewUniswapFactory()}>
                            Change Uniswap Factory
                        </Button>
                    </ButtonContainer>
                </div>
            </Box>
        </SettingsContainer>
    )
}

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;

`
const ButtonContainer = styled.div`
    margin-top: 25px;
    display: flex;
`

const MarginTopContainer = styled.div`
    margin-top: 20px;
`

export default Settings