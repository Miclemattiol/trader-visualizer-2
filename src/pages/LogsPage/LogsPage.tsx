import classNames from "classnames";
import { useLogsContext } from "../../Providers/LogsProvider";
import "./LogsPage.scss";


export const LogsPage = () => {
    const [logs, ..._] = useLogsContext();
    
    return (
        <div className="LogsPage">
            {logs.map((log, index) =>
                <div key={index} className={classNames("log", log.log_type)} >
                    [{log.date}] {log.log_type}: {log.message}
                </div>
            )}
            <div className="overflowAnchor"></div>
        </div>
    )
}