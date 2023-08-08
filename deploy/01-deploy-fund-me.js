const { network } = require("hardhat");
const { developmentChains,networkConfig } = require("../hepler-hardhat-config");
const {verify} = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments}) =>{
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
    let ethUsdPriceFeedAddress;
    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }else{
        console.log("********")
       ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
       console.log(ethUsdPriceFeedAddress)
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe",{
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

   

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, args)
    }
    console.log("____________________________________")
}
module.exports.tags = ["all","fundme"]
