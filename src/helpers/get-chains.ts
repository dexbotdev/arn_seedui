import { Networks, NetworksInfo, WMEMO_BRIDG_CHAINS, BALANCE_CHAINS } from "../constants/blockchain";

export const getChainInfo = (chain: Networks) => {
    const info = NetworksInfo[chain];
    if (!info) {
        throw Error("Chain don't support");
    }
    return info;
};

export const getBalanceChainList = (notInclude?: Networks) => {
    const list = [];
    for (const chain of BALANCE_CHAINS) {
        if (notInclude && chain === notInclude) {
            continue;
        }
        const info = getChainInfo(chain);
        list.push(info);
    }
    return list;
};

export const getChainList = (notInclude?: Networks) => {
    const list = [];

    const info = getChainInfo(Networks.AETH);
    list.push(info);
    return list;
};
