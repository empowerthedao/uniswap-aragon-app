import RPC from "./rpc";

const DAOFactory = artifacts.require('DAOFactory')
const EVMScriptRegistryFactory = artifacts.require('EVMScriptRegistryFactory')
const ACL = artifacts.require('ACL')
const Kernel = artifacts.require('Kernel')

class Snapshot {

    constructor(web3) {
        this.rpc = new RPC(web3)
    }

    async saveSnapshot() {
        this.currentSnapshotId = await this.rpc.snapshot()
    }

    async restoreSnapshot() {
        await this.rpc.revert(this.currentSnapshotId)
    }
}

class DaoDeployment {

    constructor(rootAddress) {
        this.rootAddress = rootAddress
    }

    async deploy() {
        await this.createStatelessContracts()
        await this.createDaoProxyContractsAndPermission()
    }

    async createStatelessContracts() {
        this.kernelBase = await Kernel.new(true)
        this.aclBase = await ACL.new()
        this.evmScriptRegistryFactory = await EVMScriptRegistryFactory.new()
        this.daoFactory = await DAOFactory.new(this.kernelBase.address, this.aclBase.address, this.evmScriptRegistryFactory.address)
    }

    async createDaoProxyContractsAndPermission() {
        const newKernelReceipt = await this.daoFactory.newDAO(this.rootAddress)
        this.kernel = await Kernel.at(newKernelReceipt.logs.filter(log => log.event === 'DeployDAO')[0].args.dao)
        this.acl = await ACL.at(await this.kernel.acl())

        const APP_MANAGER_ROLE = await this.kernelBase.APP_MANAGER_ROLE()
        await this.acl.createPermission(this.rootAddress, this.kernel.address, APP_MANAGER_ROLE, this.rootAddress, {from: this.rootAddress})
    }
}

class TemplateAgentChainSetup {

    constructor(snapshot, daoDeployment) {
        this.snapshot = snapshot
        this.daoDeployment = daoDeployment
    }

    async before(rootAddress) {
        await this.daoDeployment.deploy(rootAddress)
    }

    async beforeEach() {
        await this.snapshot.saveSnapshot()
    }

    async afterEach() {
        await this.snapshot.restoreSnapshot()
    }
}

export {
    Snapshot,
    DaoDeployment,
    TemplateAgentChainSetup
}