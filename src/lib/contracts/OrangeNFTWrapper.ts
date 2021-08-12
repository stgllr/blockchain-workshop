/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3 from 'web3';
import * as OrangeNFTJSON from '../../../build/contracts/OrangeNFT.json';
import { OrangeNFT } from '../../types/OrangeNFT';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class OrangeNFTWrapper {
    web3: Web3;

    contract: OrangeNFT;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(OrangeNFTJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getTotalSupply(addr: string) {
        const value = await this.contract.methods.balanceOf(addr).call();
        return value;
    }

    async getTokenSymbol() {
        const value = await this.contract.methods.symbol().call();
        return value;
    }

    async ownerOf(tokenId: number) {
        const value = await this.contract.methods.ownerOf(tokenId).call();
        return value;
    }

    async getTokenName() {
        const value = await this.contract.methods.name().call();
        return value;
    }

    async awardItem(player: string, tokenURI: string) {
        const value = await this.contract.methods.awardItem(player, tokenURI).call();
        return value;
    }

    async setTransferNFT(fromAddress: string, toAddress: string, tokenID: number) {
        const tx = await this.contract.methods.transferFrom(fromAddress, toAddress, tokenID).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return tx;
    }

    async deploy(fromAddress: string) {
        const deployTx = await (this.contract
            .deploy({
                data: OrangeNFTJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
