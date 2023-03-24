import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { ARNSeedSale } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { RootState } from "../store";
import { error } from "../../store/slices/messages-slice";
import { messages } from "../../constants/messages";
import { IData } from "src/hooks/types";
import { IToken } from "../../helpers/tokens";
import redemptionTokens from "src/helpers/redemption-tokens";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
    checkWrongNetwork: () => Promise<boolean>;
}

export const loadAppDetails = createAsyncThunk("app/loadAppDetails", async ({ networkID, provider, checkWrongNetwork }: ILoadAppDetails, { dispatch }): Promise<any> => {
    try {
        await provider.getBlockNumber();
    } catch (err) {
        console.log(err);
        dispatch(error({ text: messages.rpc_connection_lost }));
        checkWrongNetwork();
    }
    const addresses = getAddresses(networkID);

    console.log("0x3edE23145A1ca0264920e1510cE07e0b9fbA5712");
    console.log(addresses);
    const seedContract = new ethers.Contract(addresses.SEED_ADDRESS, ARNSeedSale, provider);

    const totalSeedSupply = await seedContract.seedSalehardCap();
    const soldSeeds = await seedContract.seedSaleCount();
    const availableSeed = totalSeedSupply - soldSeeds;

    console.log(totalSeedSupply + ":" + soldSeeds + ":" + availableSeed);
    return {
        totalSeedSupply: totalSeedSupply,
        availableSeed: availableSeed,
    };
});

const initialState = {
    loading: true,
};

export interface IRedemptionTokens {
    exchangeRate: number;
    token: IToken;
}

async function exchangeRate(tokenAddress: string, amount: string, provider: StaticJsonRpcProvider | JsonRpcProvider): Promise<IRedemptionTokens> {
    let token = redemptionTokens.find(_token => _token.address.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase());
    return {
        exchangeRate: 0,
        token: JSON.parse(JSON.stringify(token)),
    };
}

export interface IZapperData {
    wallet: IData[];
    vaults: IData[];
    leveragedPosition: IData[];
    liquidityPool: IData[];
    claimable: IData[];
    debt: IData[];
    farm: IData[];
}

export interface IAppSlice {
    stakingTVL: number;
    loading: boolean;
    availableSeed: number;
    totalSeedSupply: number;
    wMemoMarketPrice: number;
    marketCap: number;
    circSupply: number;
    burnSupply: number;
    currentIndex: string;
    currentBlock: number;
    currentBlockTime: number;
    fiveDayRate: number;
    treasuryBalance: number;
    stakingAPY: number;
    stakingRebase: number;
    nextRebase: number;
    totalSupply: number;
    rfvWmemo: number;
    zapper: IZapperData;
    redemptionTokens: IRedemptionTokens[];
    redemptionDeadline: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
