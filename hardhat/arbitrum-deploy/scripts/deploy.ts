import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read compiled artifact
const artifactPath = path.join(
  __dirname,
  "../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json"
);
const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

async function main() {
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY not set in .env");

  // CHANGE network here: arbitrumSepolia or arbitrumMainnet
  const provider = new ethers.JsonRpcProvider(
    // "https://sepolia-rollup.arbitrum.io/rpc" // testnet
    "https://arb1.arbitrum.io/rpc" // mainnet
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  console.log("Deploying SimpleStorage...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed at:", contract.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
