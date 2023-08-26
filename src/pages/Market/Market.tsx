import { createRef, useEffect, useRef, useState } from "react";
import { Header } from "../../components/Header/Header";
import { SideBar } from "../../components/SideBar/SideBar";
import './Market.scss';
import { useTraderData } from "../../Providers/TraderDataProvider";

import { AxisModel, Category, ChartComponent, Inject, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Zoom, ZoomSettingsModel } from '@syncfusion/ej2-react-charts';

export default () => {

    const [traderData] = useTraderData();
    const plotDivRef = createRef<HTMLDivElement>();
    const [Active, setActive] = useState(true);
    const plot = useRef<ChartComponent>(null);

    const primaryXAxis: AxisModel = { valueType: 'Category' };
    //const data = traderData.map((value, i) => ({ x: i.toString(), y: value[0], text: "Value" }));
    // console.log(traderData.map((value, i) => ({ x: i.toString(), y: value, text: "Value" })))

    const zoomSettings: ZoomSettingsModel = {
        enableSelectionZooming: true,
    }

    const palette = ["red", "white", "green", "gold"];

    useEffect(() => {
        const animationInterval = setInterval(() => plot.current?.refresh(), 5); 
        const animationTimeout = setTimeout(() => clearInterval(animationInterval), 500);
    
        return () => {
            clearInterval(animationInterval);
            clearTimeout(animationTimeout);
        };
    }, [Active]);

    return (
        <div className="Trader">
            <SideBar Active={[Active, setActive]} />
            <div className="Content">
                <Header title="MTNT Visualizer" />
                <main>
                    {/* {
                        traderData.map((day, i) => {
                            return <p key={i}>{day}</p>
                        })
                    } */}
                    <div ref={plotDivRef} className="plotContainer">
                        <ChartComponent id='charts' primaryXAxis={primaryXAxis} primaryYAxis={{ interval: 1000, }} zoomSettings={zoomSettings} palettes={palette} height="100%" ref={plot}>
                            <Inject services={[LineSeries, Category, Zoom, Legend]} />
                            <SeriesCollectionDirective>
                                <SeriesDirective dataSource={traderData.map((value, i) => ({ x: i.toString(), y: value[0], text: "Value" }))} xName='x' yName='y' type='Line' name="EUR" />
                                <SeriesDirective dataSource={traderData.map((value, i) => ({ x: i.toString(), y: value[1], text: "Value" }))} xName='x' yName='y' type='Line' name="USD" />
                                <SeriesDirective dataSource={traderData.map((value, i) => ({ x: i.toString(), y: value[2], text: "Value" }))} xName='x' yName='y' type='Line' name="YEN" />
                                <SeriesDirective dataSource={traderData.map((value, i) => ({ x: i.toString(), y: value[3], text: "Value" }))} xName='x' yName='y' type='Line' name="YUAN" />
                            </SeriesCollectionDirective>
                        </ChartComponent>
                    </div>

                </main>
            </div>
        </div>
    )
}