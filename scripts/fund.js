const { getNamedAccounts } = require("hardhat")

async function main(){
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContractAt("FundMe", deployer)
    console.log("Funding Contract...")
    const transactionResponse = await fundMe.fund({value: 10000000000})
    await transactionResponse.wait(1)
    console.log("Funded")

}

main()
    .then(()=> process.exit(0))
    .catch((error) =>{
        console.error(error)
        process.exit(1)
    })