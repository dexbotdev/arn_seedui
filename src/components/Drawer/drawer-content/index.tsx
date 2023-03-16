import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import StakeIcon from "../../../assets/icons/stake.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import WonderlandIcon from "../../../assets/mainicon.png";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress, useWeb3Context } from "../../../hooks";
import useBonds from "../../../hooks/bonds";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import DocsIcon from "../../../assets/icons/stake.svg";
import GlobeIcon from "../../../assets/icons/wonderglobe.svg";
import classnames from "classnames";
import BridgeIcon from "../../../assets/icons/bridge-alt.svg";
import { Networks, VIEWS_FOR_NETWORK } from "../../../constants";
import BlogIcon from "../../../assets/icons/medium.svg";
import FundIcon from "../../../assets/icons/fund.png";
import RedemptionIcon from "../../../assets/icons/redemption.svg";
import FarmIcon from "../../../assets/icons/farm.svg";

function NavContent() {
    const [isActive] = useState();
    const address = useAddress();
    const { bonds } = useBonds();
    const { chainID } = useWeb3Context();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            return true;
        }
        if (currentPath.indexOf("seed") >= 0 && page === "seed") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                <Link href="https://ido.arbinium.com" target="_blank">
                    <img alt="" src={WonderlandIcon} height="72px" />
                </Link>

                {address && (
                    <div className="wallet-link">
                        <Link href={`https://cchain.explorer.avax.network/address/${address}`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    {VIEWS_FOR_NETWORK[chainID].dashboard && (
                        <Link
                            component={NavLink}
                            to="/dashboard"
                            isActive={(match: any, location: any) => {
                                return checkPage(location, "dashboard");
                            }}
                            className={classnames("button-dapp-menu", { active: isActive })}
                        >
                            <div className="dapp-menu-item">
                                <img alt="" src={DashboardIcon} />
                                <p>Dashboard</p>
                            </div>
                        </Link>
                    )}

                    <Link
                        component={NavLink}
                        to="/seed"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "seed");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img alt="" src={StakeIcon} />
                            <p>Seed Sale</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NavContent;
