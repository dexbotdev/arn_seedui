import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { Grid, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAppSlice } from "../../store/slices/app-slice";
import { useHistory } from "react-router-dom";
import { usePathForNetwork, useWeb3Context } from "../../hooks";
import { Networks } from "../../constants/blockchain";
import { getChainList } from "../../helpers/get-chains";
import SelectNetwork from "./components/SelectNetwork";

function Dashboard() {
    const history = useHistory();
    const { address, connect, chainID, providerChainID, checkWrongNetworkBalance, switchNetwork } = useWeb3Context();
    usePathForNetwork({ pathName: "dashboard", networkID: chainID, history });

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const defaultToChain = useMemo(() => Number(getChainList(chainID)[0].chainId), [chainID]);

    const [toChain] = useState<Networks>(defaultToChain);

    const onNetworkSwap = (network?: Networks) => switchNetwork(network || toChain);

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <Zoom in={true}>
                    <Grid container spacing={4}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <div className="dashboard-card-header">
                                <p className="dashboard-card-header-title">Arbinium Seed Sale</p>
                            </div>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Seed Hard Cap</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="250px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 2,
                                        }).format(7)
                                    )}
                                    <span className="card-value-sub wmemo">ETH</span>
                                </p>
                            </div>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <div className="dashboard-card">
                                <p className="card-title">Seed Soft Cap</p>
                                <p className="card-value">
                                    {isAppLoading ? (
                                        <Skeleton width="250px" />
                                    ) : (
                                        new Intl.NumberFormat("en-US", {
                                            maximumFractionDigits: 2,
                                            minimumFractionDigits: 2,
                                        }).format(3.5)
                                    )}
                                    <span className="card-value-sub wmemo"> ETH</span>
                                </p>
                            </div>
                        </Grid>

                        {!address && (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className="dashboard-card-wallet-notification">
                                    <div className="dashboard-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="dashboard-card-wallet-desc-text">Connect your wallet to view your portfolio!</p>
                                </div>
                            </Grid>
                        )}
                        {providerChainID !== Networks.AETH && (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className="dashboard-card-wallet-notification">
                                    <SelectNetwork network={chainID} from handleSelect={onNetworkSwap} />
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </Zoom>
            </div>
        </div>
    );
}

export default Dashboard;
