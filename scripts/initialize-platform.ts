import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

async function initializePlatform() {
  try {
    // 配置连接参数（可以通过环境变量覆盖）
    const rpcUrl = process.env.ANCHOR_PROVIDER_URL || "https://api.devnet.solana.com";
    const walletPath = process.env.ANCHOR_WALLET || path.join(os.homedir(), ".config/solana/id.json");

    console.log("连接配置:");
    console.log("- RPC URL:", rpcUrl);
    console.log("- 钱包路径:", walletPath);
    console.log("");

    // 读取钱包
    let keypair: Keypair;
    try {
      const walletData = JSON.parse(fs.readFileSync(walletPath, "utf8"));
      keypair = Keypair.fromSecretKey(new Uint8Array(walletData));
    } catch (error) {
      console.error("❌ 无法读取钱包文件:", walletPath);
      console.error("请确保钱包文件存在，或设置 ANCHOR_WALLET 环境变量");
      throw error;
    }

    // 创建 connection 和 provider
    const connection = new Connection(rpcUrl, "confirmed");
    const wallet = new Wallet(keypair);
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    anchor.setProvider(provider);

    // 加载程序
    const programId = new PublicKey("7E14Uz3c1CUoXaxkiGyP2WeqXDzxrMRgFu9pAVrrxLkx");
    const idl = JSON.parse(
      fs.readFileSync("./target/idl/creator_economy.json", "utf8")
    );
    const program = new Program(idl, provider);

    // 获取平台 PDA
    const [platformPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    console.log("正在初始化平台...");
    console.log("程序 ID:", program.programId.toString());
    console.log("平台 PDA:", platformPDA.toString());
    console.log("管理员:", provider.wallet.publicKey.toString());

    // 平台配置参数
    const earlySupporterLimit = 10; // 前 10 个支持者
    const earlySupporterRate = 1000; // 10% = 1000 / 10000
    const platformFeeRate = 200; // 2% = 200 / 10000

    // 初始化平台
    const tx = await program.methods
      .initializePlatform(
        earlySupporterLimit,
        earlySupporterRate,
        platformFeeRate
      )
      .accounts({
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("\n✅ 平台初始化成功！");
    console.log("交易签名:", tx);
    console.log("\n平台配置:");
    console.log("- 早期支持者上限:", earlySupporterLimit, "人");
    console.log("- 早期支持者分成:", earlySupporterRate / 100, "%");
    console.log("- 平台手续费:", platformFeeRate / 100, "%");

    // 等待确认
    await provider.connection.confirmTransaction(tx, "confirmed");

    // 验证平台账户
    // @ts-ignore
    const platformAccount = await program.account.platform.fetch(platformPDA);
    console.log("\n平台账户信息:");
    console.log("- 管理员:", platformAccount.authority.toString());
    console.log("- 内容总数:", platformAccount.totalContentCount.toString());
    console.log("- Bump:", platformAccount.bump);

  } catch (error: any) {
    console.error("❌ 初始化失败:", error);
    if (error.logs) {
      console.error("\n程序日志:");
      error.logs.forEach((log: string) => console.error(log));
    }
    throw error;
  }
}

// 运行脚本
initializePlatform()
  .then(() => {
    console.log("\n脚本执行完成");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
