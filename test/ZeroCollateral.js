const FakeDAI = artifacts.require('ERC20Mintable')
const ZeroCollateral = artifacts.require('zeroCollateralMain')

contract('test all the things', accounts => {
    const deployer = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]

    it('check deployed', async () => {
        const zeroCollateral = await ZeroCollateral.deployed()
        const fakeDAI = await FakeDAI.deployed()

        assert(fakeDAI.address === await zeroCollateral.DAI_CONTRACT(), 'incorrect fakeDAI')
    })

    it('mint fake DAI', async () => {
        const amount = '10000000000000000000000000000000000' // 1 Fake DAI = 10^17
        const zeroCollateral = await ZeroCollateral.deployed()
        const fakeDAI = await FakeDAI.deployed()
        const txAlice = await fakeDAI.mint(alice, amount)
        const txBob = await fakeDAI.mint(bob, amount)

        await fakeDAI.approve(zeroCollateral.address, amount, { from: alice })
        await fakeDAI.approve(zeroCollateral.address, amount, { from: bob })

        const aliceBalance = await fakeDAI.balanceOf.call(alice)
        const bobBalance = await fakeDAI.balanceOf.call(bob)

        assert(aliceBalance == amount, 'alice fake DAI balance failed')
        assert(bobBalance == amount, 'alice fake DAI balance failed')
    })

    it('borrow', async () => {
        const zeroCollateral = await ZeroCollateral.deployed()
        const fakeDAI = await FakeDAI.deployed()

        const printBalance = async () => console.log('Zero Collateral Balance:', (await fakeDAI.balanceOf(zeroCollateral.address)).toString())
        const printBalanceAlice = async () => console.log('Alice Balance:', (await fakeDAI.balanceOf(alice)).toString())

        // await zeroCollateral.collateralDeposited(console.log) // subscribe to event

        await printBalance()
        await printBalanceAlice()

        // await zeroCollateral.mintZDAI(10, { from: alice })

        // await printBalance()
        // await printBalanceAlice()

        const maxBorrow = await zeroCollateral.maxBorrow.call({ from: alice })
        console.log('maxBorrow:', maxBorrow.toString())
        const collateralNeeded = await zeroCollateral.getCollateralNeeded.call(maxBorrow.toString(), { from: alice })
        console.log('collateralNeeded:', collateralNeeded.toString())

        const amount = collateralNeeded
        await zeroCollateral.depositCollateralBorrower(amount, { from: alice })

        await printBalance()
        await printBalanceAlice()

        // console.log(await zeroCollateral.getRedemptionPool.call())

        for(let i = 0; i < 10; i++) {
            await printBalance()
            await printBalanceAlice()

            // await zeroCollateral.borrowInitiated(console.log) // subscribe to event
            await zeroCollateral.createBorrow(10, { from: alice })

            await printBalance()
            await printBalanceAlice()

            await zeroCollateral.repayBorrow(13, { from: alice })

            console.log('maxBorrow:', (await zeroCollateral.maxBorrow.call({ from: alice })).toString())

        }
    })
})
