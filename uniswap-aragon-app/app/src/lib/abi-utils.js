

const convertToDaiErc20Abi = (erc20Abi) => {
    return [...erc20Abi, erc20Abi
        .filter(abiFunction => abiFunction.name === "name" || abiFunction.name === "symbol")
        .map(abiFunction => abiFunction.outputs[0].type = "bytes32")]
}

export {
    convertToDaiErc20Abi
}
