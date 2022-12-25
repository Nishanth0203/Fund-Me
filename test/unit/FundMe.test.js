const {deployments, ethers, getNamedAccounts} = require("hardhat")
const {assert, expect} = require("chai")
describe ("FundMe",async function() {
    let deployer
    let fundMe
    let mockV3Aggreagtor
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async () => {
        // const accounts = await ethers.getSigner()
       deployer = (await getNamedAccounts()).deployer
        await deployments.fixture("all")
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggreagtor = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor",async function() {
        isCallTrace("Sets the aggreagtor address correctly", async function(){
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggreagtor.address)
        })
    })

    describe("fund", async function() {
        if("fails if you dont send eths", async function() {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need send more ETH"
            )
        })
        it("updated the amount funded data structure", async () => {
            await fundMe.fund({value: sendValue})
            const response = await fundMe.getAddressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async() => {
            await fundMe.fund({value: sendValue})
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        }) 
    })
    describe("withdraw", function() {
        beforeEach(async() => {
            await fundMe.fund({ value: sendValue})
        })
        it("withdraws ETH from a single funder", async() => {
            //arrange
            const startingFundMeBalance = 
                await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = 
                await fundMe.provider.getBalance(deployer)

            //act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const {gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUSed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = 
                await fundMe.provider.getBalance(deployer)
            
            //assert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        it("allows us to withdraw from multiple funders", async function() {
            const ethers = await ethers.getsigners()
            for(let i=1; i<6;i++) {
                const fundMeConnectedContract = await fundMe.connect (
                    accounts[i]
                )
                await fundMeConnectedContract.fund({value: sendValue})
            }
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = 
                await fundMe.provider.getBalance(deployer)
            
            //act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const {gasUsed, effectiveGasPrice} = transactionReceipt
            const gasCost = gasUSed.mul(effectiveGasPrice)
            //assert
            assert.equal(endingFundMeBalance,0)
            assert.equal(
                startingFundMeBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
            //make sure the funders are reset properly
            await expect(fundMe.funders(0)).to.be.revertedWith
            for(i=1; i<6 ;i++) {
                assert.equal(await fundMe.getAddressToAmountFunded(
                    accounts[i].address
                ),0)
            }
        })

        it("only allows owner to withdraw", async() => {
            const accounts = ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedcontract.withdraw()).to.be.reverted
        })
    })
})