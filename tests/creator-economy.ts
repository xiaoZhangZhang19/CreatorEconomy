import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CreatorEconomy } from "../target/types/creator_economy";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("creator-economy", () => {
  // 配置提供者
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CreatorEconomy as Program<CreatorEconomy>;

  // 测试钱包
  const authority = provider.wallet;
  const creator = anchor.web3.Keypair.generate();
  const tipper1 = anchor.web3.Keypair.generate();
  const tipper2 = anchor.web3.Keypair.generate();

  // PDA 账户
  let platformPDA: PublicKey;
  let platformBump: number;
  let creatorProfilePDA: PublicKey;
  let contentPDA: PublicKey;
  let platformTreasury: PublicKey;

  before(async () => {
    // 空投 SOL 到测试钱包
    const airdropCreator = await provider.connection.requestAirdrop(
      creator.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropCreator);

    const airdropTipper1 = await provider.connection.requestAirdrop(
      tipper1.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropTipper1);

    const airdropTipper2 = await provider.connection.requestAirdrop(
      tipper2.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropTipper2);

    // 派生 Platform PDA
    [platformPDA, platformBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    // 派生 CreatorProfile PDA
    [creatorProfilePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("creator"), creator.publicKey.toBuffer()],
      program.programId
    );

    // 平台金库（这里使用 authority 的地址，实际应该是专门的金库账户）
    platformTreasury = authority.publicKey;
  });

  it("初始化平台", async () => {
    const tx = await program.methods
      .initializePlatform(
        10, // early_supporter_limit
        1000, // early_supporter_rate (10%)
        200 // platform_fee_rate (2%)
      )
      .accounts({
        authority: authority.publicKey,
        platform: platformPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("初始化平台交易签名:", tx);

    // 验证平台账户
    const platformAccount = await program.account.platform.fetch(platformPDA);
    assert.equal(
      platformAccount.authority.toBase58(),
      authority.publicKey.toBase58()
    );
    assert.equal(platformAccount.totalContentCount.toNumber(), 0);
    assert.equal(platformAccount.earlySupporterLimit, 10);
    assert.equal(platformAccount.earlySupporterRate, 1000);
    assert.equal(platformAccount.platformFeeRate, 200);
  });

  it("创建创作者资料", async () => {
    const tx = await program.methods
      .createCreatorProfile()
      .accounts({
        creator: creator.publicKey,
        creatorProfile: creatorProfilePDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    console.log("创建创作者资料交易签名:", tx);

    // 验证创作者资料
    const creatorProfileAccount = await program.account.creatorProfile.fetch(
      creatorProfilePDA
    );
    assert.equal(
      creatorProfileAccount.creator.toBase58(),
      creator.publicKey.toBase58()
    );
    assert.equal(creatorProfileAccount.contentCount, 0);
    assert.equal(creatorProfileAccount.totalEarnings.toNumber(), 0);
  });

  it("发布内容", async () => {
    const contentId = 0;

    // 派生 Content PDA
    [contentPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("content"),
        Buffer.from(new anchor.BN(contentId).toArrayLike(Buffer, "le", 8)),
      ],
      program.programId
    );

    const title = "我的第一篇文章";
    const description =
      "这是一篇测试文章，介绍创作者经济平台的使用方法。";

    const tx = await program.methods
      .publishContent(title, description)
      .accounts({
        creator: creator.publicKey,
        creatorProfile: creatorProfilePDA,
        content: contentPDA,
        platform: platformPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    console.log("发布内容交易签名:", tx);

    // 验证内容账户
    const contentAccount = await program.account.content.fetch(contentPDA);
    assert.equal(contentAccount.contentId.toNumber(), contentId);
    assert.equal(
      contentAccount.creator.toBase58(),
      creator.publicKey.toBase58()
    );
    assert.equal(contentAccount.title, title);
    assert.equal(contentAccount.description, description);
    assert.equal(contentAccount.totalTips.toNumber(), 0);
    assert.equal(contentAccount.tipCount, 0);
    assert.equal(contentAccount.earlySupporters.length, 0);

    // 验证平台内容计数增加
    const platformAccount = await program.account.platform.fetch(platformPDA);
    assert.equal(platformAccount.totalContentCount.toNumber(), 1);

    // 验证创作者资料内容计数增加
    const creatorProfileAccount = await program.account.creatorProfile.fetch(
      creatorProfilePDA
    );
    assert.equal(creatorProfileAccount.contentCount, 1);
  });

  it("打赏内容 - 第 1 个早期支持者", async () => {
    const tipAmount = new anchor.BN(0.01 * LAMPORTS_PER_SOL);

    const tipper1BalanceBefore = await provider.connection.getBalance(
      tipper1.publicKey
    );
    const creatorBalanceBefore = await provider.connection.getBalance(
      creator.publicKey
    );

    const tx = await program.methods
      .tipContent(tipAmount)
      .accounts({
        tipper: tipper1.publicKey,
        creator: creator.publicKey,
        content: contentPDA,
        creatorProfile: creatorProfilePDA,
        platform: platformPDA,
        platformTreasury: platformTreasury,
        systemProgram: SystemProgram.programId,
      })
      .signers([tipper1])
      .rpc();

    console.log("打赏内容交易签名:", tx);

    // 验证内容账户
    const contentAccount = await program.account.content.fetch(contentPDA);
    assert.equal(contentAccount.totalTips.toNumber(), tipAmount.toNumber());
    assert.equal(contentAccount.tipCount, 1);
    assert.equal(contentAccount.earlySupporters.length, 1);
    assert.equal(
      contentAccount.earlySupporters[0].toBase58(),
      tipper1.publicKey.toBase58()
    );

    // 验证余额变化
    const tipper1BalanceAfter = await provider.connection.getBalance(
      tipper1.publicKey
    );
    const creatorBalanceAfter = await provider.connection.getBalance(
      creator.publicKey
    );

    // 打赏者余额应该减少约 0.01 SOL（加上交易费，最多 0.1 SOL）
    const tipper1Diff = tipper1BalanceBefore - tipper1BalanceAfter;
    const maxTransactionFee = 0.1 * LAMPORTS_PER_SOL; // 放宽交易费限制
    assert.isTrue(
      tipper1Diff >= tipAmount.toNumber() &&
        tipper1Diff <= tipAmount.toNumber() + maxTransactionFee,
      `Tipper balance diff ${tipper1Diff} should be between ${tipAmount.toNumber()} and ${tipAmount.toNumber() + maxTransactionFee}`
    );

    // 创作者余额应该增加约 0.0098 SOL（扣除 2% 平台费）
    const expectedCreatorAmount = tipAmount.toNumber() * 0.98;
    const creatorDiff = creatorBalanceAfter - creatorBalanceBefore;
    assert.isTrue(
      Math.abs(creatorDiff - expectedCreatorAmount) <
        expectedCreatorAmount * 0.01
    );

    console.log("打赏者余额变化:", tipper1Diff / LAMPORTS_PER_SOL, "SOL");
    console.log("创作者余额变化:", creatorDiff / LAMPORTS_PER_SOL, "SOL");
  });

  it("打赏内容 - 第 2 个早期支持者", async () => {
    const tipAmount = new anchor.BN(0.01 * LAMPORTS_PER_SOL);

    const tx = await program.methods
      .tipContent(tipAmount)
      .accounts({
        tipper: tipper2.publicKey,
        creator: creator.publicKey,
        content: contentPDA,
        creatorProfile: creatorProfilePDA,
        platform: platformPDA,
        platformTreasury: platformTreasury,
        systemProgram: SystemProgram.programId,
      })
      .signers([tipper2])
      .rpc();

    console.log("第 2 次打赏交易签名:", tx);

    // 验证内容账户
    const contentAccount = await program.account.content.fetch(contentPDA);
    assert.equal(contentAccount.tipCount, 2);
    assert.equal(contentAccount.earlySupporters.length, 2);
  });

  it("验证错误：打赏金额过小", async () => {
    const tinyAmount = new anchor.BN(100_000); // 0.0001 SOL，低于最低 0.001 SOL

    try {
      await program.methods
        .tipContent(tinyAmount)
        .accounts({
          tipper: tipper1.publicKey,
          creator: creator.publicKey,
          content: contentPDA,
          creatorProfile: creatorProfilePDA,
          platform: platformPDA,
          platformTreasury: platformTreasury,
          systemProgram: SystemProgram.programId,
        })
        .signers([tipper1])
        .rpc();

      assert.fail("应该抛出 TipTooSmall 错误");
    } catch (error) {
      assert.include(
        error.message,
        "打赏金额过小",
        "错误消息应包含 TipTooSmall"
      );
    }
  });

  it("验证错误：不能打赏自己的内容", async () => {
    const tipAmount = new anchor.BN(0.01 * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .tipContent(tipAmount)
        .accounts({
          tipper: creator.publicKey,
          creator: creator.publicKey,
          content: contentPDA,
          creatorProfile: creatorProfilePDA,
          platform: platformPDA,
          platformTreasury: platformTreasury,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();

      assert.fail("应该抛出 CannotTipSelf 错误");
    } catch (error) {
      assert.include(
        error.message,
        "不能打赏自己的内容",
        "错误消息应包含 CannotTipSelf"
      );
    }
  });
});
