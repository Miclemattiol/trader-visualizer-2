import classNames from "classnames";
import { useLogsContext } from "../../Providers/LogsProvider";
import "./LogsPage.scss";
import { useEffect } from "react";


export const LogsPage = () => {
    const [logs, _, readLogs] = useLogsContext();
    
    useEffect(() => {
        readLogs();
    }, [logs.length]);

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