const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("FlagRoles", function () {
  async function deployFlagRoles() {
    const [owner, both, moderator, minter, none] = await ethers.getSigners();

    const FlagRoles = await ethers.getContractFactory("MockFlagRoles");
    const flagRoles = await FlagRoles.deploy(
      both.address,
      minter.address,
      moderator.address
    );

    const moderatorRole = await flagRoles.MODERATOR();
    const minterRole = await flagRoles.MINTER();
    const bothRole = await flagRoles.BOTH();

    return {
      flagRoles,
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
        both: bothRole,
      },
    };
  }

  describe("onlyRole", function () {
    it("Should not revert when user has role", async function () {
      const { flagRoles, wallets } = await loadFixture(
        deployFlagRoles
      );

      await expect(
        flagRoles.connect(wallets.moderator).EnsureModerator()
      ).to.not.be.reverted;
      await expect(
        flagRoles.connect(wallets.both).EnsureModerator()
      ).to.not.be.reverted;
      await expect(
        flagRoles.connect(wallets.minter).EnsureMinter()
      ).to.not.be.reverted;
      await expect(
         flagRoles.connect(wallets.both).EnsureMinter()
      ).to.not.be.reverted;
      await expect(
        flagRoles.connect(wallets.both).EnsureBoth()
     ).to.not.be.reverted;
    });

    it("Should revert when a user does not have a role", async function () {
      const { flagRoles, wallets } = await loadFixture(
        deployFlagRoles
      );

      await expect(
        flagRoles.connect(wallets.minter).EnsureModerator()
      ).to.be.revertedWithCustomError(flagRoles, "IncorrectRoleError");
      await expect(
        flagRoles.connect(wallets.minter).EnsureBoth()
     ).to.be.revertedWithCustomError(flagRoles, "IncorrectRoleError");
      await expect(
        flagRoles.connect(wallets.moderator).EnsureMinter()
      ).to.be.revertedWithCustomError(flagRoles, "IncorrectRoleError");
      await expect(
        flagRoles.connect(wallets.moderator).EnsureBoth()
     ).to.be.revertedWithCustomError(flagRoles, "IncorrectRoleError");
      await expect(
        flagRoles.connect(wallets.none).EnsureModerator()
      ).to.be.revertedWithCustomError(flagRoles, "IncorrectRoleError");
      await expect(
         flagRoles.connect(wallets.none).EnsureMinter()
      ).to.be.revertedWithCustomError(flagRoles, "IncorrectRoleError");
      await expect(
        flagRoles.connect(wallets.none).EnsureBoth()
     ).to.be.revertedWithCustomError(flagRoles, "IncorrectRoleError");
    });
  });

  describe("hasRole", function () {
    it("Should be true when a user has a role", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(true);
      expect(
        await flagRoles.hasRole(roles.moderator, wallets.both.address)
      ).to.equal(true);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.minter.address)
      ).to.equal(true);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.both.address)
      ).to.equal(true);
    });

    it("Should be false when a user does not have a role", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.minter.address)
      ).to.equal(false);
      expect(
        await flagRoles.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(false);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.moderator.address)
      ).to.equal(false);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.none.address)
      ).to.equal(false);
    });

    it("Should be callable by anyone", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await expect(
        flagRoles
          .connect(wallets.none)
          .hasRole(roles.moderator, wallets.none.address)
      ).to.not.be.reverted;
    });
  });

  describe("grantRole", function () {
    it("Should grant a role", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.grantRole(roles.moderator, wallets.none.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(true);
    });

    it("Should grant multiple roles", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.grantRole(roles.moderator, wallets.none.address);
      await flagRoles.grantRole(roles.minter, wallets.none.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(true);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.none.address)
      ).to.equal(true);
    });

    it("Should grant multiple roles at once", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.grantRole(roles.both, wallets.none.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(true);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.none.address)
      ).to.equal(true);
    });

    it("Should grant multiple roles at once even if the user already has one", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.grantRole(roles.both, wallets.moderator.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(true);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.moderator.address)
      ).to.equal(true);
    });

    it("Should not break granting duplicate role", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.grantRole(roles.moderator, wallets.none.address);
      await flagRoles.grantRole(roles.moderator, wallets.none.address);
      await flagRoles.grantRole(roles.moderator, wallets.none.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.none.address)
      ).to.equal(true);
    });

    it("Should only be callable by the owner", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await expect(
        flagRoles
          .connect(wallets.none)
          .grantRole(roles.moderator, wallets.none.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("revokeRole", function () {
    it("Should revoke a role", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.revokeRole(roles.moderator, wallets.moderator.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(false);
    });

    it("Should revoke multiple roles", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.revokeRole(roles.moderator, wallets.both.address);
      await flagRoles.revokeRole(roles.minter, wallets.both.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.both.address)
      ).to.equal(false);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.both.address)
      ).to.equal(false);
    });

    it("Should revoke multiple at once roles", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.revokeRole(roles.both, wallets.both.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.both.address)
      ).to.equal(false);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.both.address)
      ).to.equal(false);
    });

    it("Should revoke multiple at once roles even if the user does not have one", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.revokeRole(roles.both, wallets.moderator.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(false);
      expect(
        await flagRoles.hasRole(roles.minter, wallets.moderator.address)
      ).to.equal(false);
    });

    it("Should not break revoking a role the user does not have", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await flagRoles.revokeRole(roles.moderator, wallets.moderator.address);
      await flagRoles.revokeRole(roles.moderator, wallets.moderator.address);
      await flagRoles.revokeRole(roles.moderator, wallets.moderator.address);

      expect(
        await flagRoles.hasRole(roles.moderator, wallets.moderator.address)
      ).to.equal(false);
    });

    it("Should only be callable by the owner", async function () {
      const { flagRoles, wallets, roles } = await loadFixture(
        deployFlagRoles
      );

      await expect(
        flagRoles
          .connect(wallets.none)
          .revokeRole(roles.moderator, wallets.none.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
