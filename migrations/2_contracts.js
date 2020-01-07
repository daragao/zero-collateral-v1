const FakeDAI = artifacts.require('ERC20Mintable')
const ZeroCollateral = artifacts.require('zeroCollateralMain')

module.exports = deployer => {
    deployer.then(async () => {
        const decimals = 0
        const fakeDAI = await deployer.deploy(FakeDAI, 'FakeDAI', 'fDAI', decimals)
        const zeroCollateral = await deployer.deploy(ZeroCollateral, fakeDAI.address, 'ZeroDAI', 'zDai', decimals)
    })
}
