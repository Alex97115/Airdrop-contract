import { ethers, network, run } from 'hardhat'

async function main() {
  console.log('Deploying NFT...')
  const [deployer, recipient] = await ethers.getSigners()

  const args: any[] = []
  const NexthFT = await ethers.getContractFactory('NexthFT')
  const nft = await NexthFT.deploy(...args)

  await nft.deployed()

  console.log(`NFT deployed to ${nft.address}`)

  if (network.config.chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
    console.log(`Waiting for block confirmation...`)
    await nft.deployTransaction.wait(10)

    console.log('Verifying contract...')
    try {
      run('verify:verify', {
        address: nft.address,
        constructorArguments: args,
        contract: 'contracts/NFT.sol:NexthFT',
      })
    } catch (e) {
      console.log(e)
    }
  }

  await nft.safeMint(deployer.address)
  await nft.safeMint(recipient.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
