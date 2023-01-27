const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("AccessControl", function () {
  async function deployAccessControl() {
    const [owner, both, moderator, minter, none] = await ethers.getSigners();

    const AccessControl = await ethers.getContractFactory("MockAccessControl");
    const accessControl = await AccessControl.deploy(
      both.address,
      minter.address,
      moderator.address
    );

    const moderatorRole = await accessControl.MODERATOR();
    const minterRole = await accessControl.MINTER();

    return {
      accessControl,
      wallets: {
        owner,
        both,
        moderator,
        minter,
        none,
      },
      roles: {
        moderator: moderatorRole,
        minter: minterRole,
      },
    };
  }

  describe("onlyRole", function () {
    it("Should not revert when user has role", async function () {
      const { accessControl, wallets } = await loadFixture(
        deployAccessControl
      );

      await expect(
        accessControl.connect(wallets.moderator).EnsureModerator()
      ).to.not.be.reverted;
      await expect(
        accessControl.connect(wallets.both).EnsureModerator()
      ).to.not.be.reverted;
      await expect(
        accessControl.connect(wallets.minter).EnsureMinter()
      ).to.not.be.reverted;
      await expect(
         accessControl.connect(wallets.both).EnsureMinter()
      ).to.not.be.reverted;
      await expect(
        accessControl.connect(wallets.both).EnsureBoth()
     ).to.not.be.reverted;
    });

    it("Should revert when a user does not have a role", async function () {
      const { accessControl, wallets } = await loadFixture(
        deployAccessControl
      );

      await expect(
        accessControl.connect(wallets.minter).EnsureModerator()
      ).to.be.reverted;
      await expect(
        accessControl.connect(wallets.minter).EnsureBoth()
     ).to.be.reverted;
      await expect(
        accessControl.connect(wallets.moderator).EnsureMinter()
      ).to.be.reverted;
      await expect(
        accessControl.connect(wallets.moderator).EnsureBoth()
     ).to.be.reverted;
      await expect(
        accessControl.connect(wallets.none).EnsureModerator()
      ).to.be.reverted;
      await expect(
         accessControl.connect(wallets.none).EnsureMinter()
      ).to.be.reverted;
      await expect(
        accessControl.connect(wallets.none).EnsureBoth()
     ).to.be.reverted;
    });
  });

  describe("hasRole", function () {
    it("Should be true when a user has a role", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      expect(
        await accessControl.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(true);
      expect(
        await accessControl.hasRole(roles.moderator, wallets.both.address)
      ).to.equal(true);
      expect(
        await accessControl.hasRole(roles.minter, wallets.minter.address)
      ).to.equal(true);
      expect(
        await accessControl.hasRole(roles.minter, wallets.both.address)
      ).to.equal(true);
    });

    it("Should be false when a user does not have a role", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      expect(
        await accessControl.hasRole(roles.moderator, wallets.minter.address)
      ).to.equal(false);
      expect(
        await accessControl.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(false);
      expect(
        await accessControl.hasRole(roles.minter, wallets.moderator.address)
      ).to.equal(false);
      expect(
        await accessControl.hasRole(roles.minter, wallets.none.address)
      ).to.equal(false);
    });

    it("Should be callable by anyone", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await expect(
        accessControl
          .connect(wallets.none)
          .hasRole(roles.moderator, wallets.none.address)
      ).to.not.be.reverted;
    });
  });

  describe("grantRole", function () {
    it("Should grant a role", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.grantRole(roles.moderator, wallets.none.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(true);
    });

    it("Should grant multiple roles", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.grantRole(roles.moderator, wallets.none.address);
      await accessControl.grantRole(roles.minter, wallets.none.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(true);
      expect(
        await accessControl.hasRole(roles.minter, wallets.none.address)
      ).to.equal(true);
    });

    it("Should grant multiple roles at once even if the user already has one", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.grantRole(roles.moderator, wallets.moderator.address);
      await accessControl.grantRole(roles.minter, wallets.moderator.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(true);
      expect(
        await accessControl.hasRole(roles.minter, wallets.moderator.address)
      ).to.equal(true);
    });

    it("Should not break granting duplicate role", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.grantRole(roles.moderator, wallets.none.address);
      await accessControl.grantRole(roles.moderator, wallets.none.address);
      await accessControl.grantRole(roles.moderator, wallets.none.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(true);
    });

    it("Should only be callable by the admin", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await expect(
        accessControl
          .connect(wallets.none)
          .grantRole(roles.moderator, wallets.none.address)
      ).to.be.revertedWith("AccessControl: account 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000");
    });
  });

  describe("revokeRole", function () {
    it("Should revoke a role", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.revokeRole(roles.moderator, wallets.moderator.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(false);
    });

    it("Should revoke multiple roles", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.revokeRole(roles.moderator, wallets.both.address);
      await accessControl.revokeRole(roles.minter, wallets.both.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.both.address)
      ).to.equal(false);
      expect(
        await accessControl.hasRole(roles.minter, wallets.both.address)
      ).to.equal(false);
    });

    it("Should revoke multiple at once roles even if the user does not have one", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.revokeRole(roles.moderator, wallets.moderator.address);
      await accessControl.revokeRole(roles.minter, wallets.moderator.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(false);
      expect(
        await accessControl.hasRole(roles.minter, wallets.moderator.address)
      ).to.equal(false);
    });

    it("Should not break revoking a role the user does not have", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await accessControl.revokeRole(roles.moderator, wallets.moderator.address);
      await accessControl.revokeRole(roles.moderator, wallets.moderator.address);
      await accessControl.revokeRole(roles.moderator, wallets.moderator.address);

      expect(
        await accessControl.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(false);
    });

    it("Should only be callable by the admin", async function () {
      const { accessControl, wallets, roles } = await loadFixture(
        deployAccessControl
      );

      await expect(
        accessControl
          .connect(wallets.none)
          .revokeRole(roles.moderator, wallets.none.address)
      ).to.be.revertedWith("AccessControl: account 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000");
    });
  });
});