const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat")

!developmentChains.includes(network.name) ? describe.skip :
describe("FundMe", async function(){


    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");
    beforeEach(async function(){
        deployer  = (await getNamedAccounts()).deployer
        await deployments.fixture("all")
        fundMe = await ethers.getContractAt("FundMe",deployer)
        mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", deployer)
    })

    describe("constructor", async function(){

        it("sets the aggregator addresses correctly", async function(){
            const response = await fundMe.runner.address
            const temp = await mockV3Aggregator.runner.address
            console.log("xxxxxxxxxxxxxxxxx")
            console.log(mockV3Aggregator)
            console.log("yyyyyyyyyyyyy")
            assert.equal(response, temp)

    })
})
    
    

    describe("fund", async function(){

        it("Fails if you don't send enough ETH", async function(){
            //await fundMe.fund()
            await expect(fundMe.fund()).to.be.revertedWith(
               "You need to spend more ETH"
            )
        })
        it("updated the amount funded", async function(){
            await fundMe.fund({value : sendValue})
            const response = await fundMe.getAddressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async function(){
            await fundMe.fund({value : sendValue})
            const funder = await fundMe.getFunders(0)
            assert(funder, deployer)
        })
    })

    describe("withdraw", async function(){
        beforeEach(async function(){
            await fundMe.fund({value: sendValue});
        })

        it("Withdraw ETH from a single founder", async function(){

            const startingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            
            assert.equal(endingFundMeBalance,0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance), endingDeployerBalance)


    
        })




    })
})