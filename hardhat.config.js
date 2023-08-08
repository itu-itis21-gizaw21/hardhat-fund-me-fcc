require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("dotenv").config()
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter")
require("solidity-coverage")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL 
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
 
  //solidity: "0.8.0",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork : "hardhat",
  networks:{
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    sepolia:{
        chainId: 11155111,
        url: SEPOLIA_RPC_URL,
        accounts : [PRIVATE_KEY],
        blockConfirmations: 6
    },
  },
  etherscan:{
    apiKey: ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: false,
    currency:"USD",
  },
  namedAccounts:{
    deployer:{
      default: 0,
    },
    user:{
      default: 1,
    }
  }
};
