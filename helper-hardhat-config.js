// const networkConfig = {
//     5: {
//         name: " goerli",
//         ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
//     },

//     137: {
//         name: "polygon",
//         ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
//     },
// }

// const developmentChains = ["hardhat","localhost"]
// const DECIMALS = 8
// const INITIAL_ANSWER = 200000000

// module.exports = {
//     networkConfig,
//     developmentChains,
//     DECIMALS,
//     INITIAL_ANSWER,
// }

const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    42: {
        name: "kovan",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    },
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}