import { CenterFocusStrong } from "@mui/icons-material";
import noDataFound from "../../../assets/images/noDataFound.png"
import './nodatafound.scss';

const NoDataFound = () => {
    return (
        <div>
           <img src={noDataFound} alt="no data found" style={{ width: "400px", height: "400px" }} />
            <div className ="textAlign">
            <h3>Oops! No alerts added </h3>
            <div><span>Alerts created for cameras will appear here</span></div>
            </div>
        </div>
    );
};

export default NoDataFound;
