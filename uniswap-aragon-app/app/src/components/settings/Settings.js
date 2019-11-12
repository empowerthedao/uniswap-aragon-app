import React from "react"
import styled from 'styled-components'
import {Box, Button, IdentityBadge, Text, Info} from "@aragon/ui";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const Settings = ({handleNewAgent, handleNewUniswapFactory, settings, compactMode}) => {
    let {agentAddress, uniswapFactoryAddress} = settings

    return (
        <div css={`display: flex;
                flex-direction: ${compactMode ? "column" : "row"};
                justify-content: space-between;
                align-items: flex-start;
                margin: 0px -10px;
                flex-wrap: wrap;
               `}
        >

            <div css={`
             flex-basis: 0;
             flex-grow: 1; 
             margin: 0px 10px;
             margin-bottom: 20px;
             ${compactMode && "width: 100%; padding-right: 20px;"}
             `}>
                <Box heading={"Uniswap Factory Address"} css={`flex-basis: 50%;`}>
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

                        <ButtonContainer>
                            <Button onClick={() => handleNewUniswapFactory()}>
                                Change Uniswap Factory
                            </Button>
                        </ButtonContainer>
                    </div>
                </Box>
            </div>

            <div css={`
            flex-basis: 0; 
            flex-grow: 1; 
            margin: 0px 10px; 
            margin-bottom: 20px;
            ${compactMode && "width: 100%; padding-right: 20px;"}

            `}>
                <Box heading={"Agent Address"}>

                    <div css={`display: flex; flex-direction: column;`}>
                        <Text>
                            The Aragon Agent contract instance that the Uniswap app uses to interact with
                            Uniswap. All funds are stored in the Agent address.
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
                                    Only send ERC20 tokens to this address via the transfer process provided.
                                </strong>
                            </Info>
                        </MarginTopContainer>

                        <ButtonContainer>
                            <Button onClick={() => handleNewAgent()}>
                                Change Agent
                            </Button>
                        </ButtonContainer>
                    </div>
                </Box>
            </div>
        </div>
    )
}

const ButtonContainer = styled.div`
    margin-top: 25px;
    display: flex;
`

const MarginTopContainer = styled.div`
    margin-top: 20px;
`

export default Settings