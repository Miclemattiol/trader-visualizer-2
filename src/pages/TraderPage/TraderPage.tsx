import { AxisModel, Category, ChartComponent, Crosshair, Inject, Legend, LineSeries, MarkerSettingsModel, SeriesCollectionDirective, SeriesDirective, Tooltip, TooltipSettingsModel, Zoom, ZoomSettingsModel } from '@syncfusion/ej2-react-charts';
import './TraderPage.scss';
import { useTraderDailyUpdate } from '../../Providers/TraderDailyUpdateProvider';
import { MarketEvent } from '../../assets/types';
import { useWatchedCurrencies } from '../../Providers/WatchedCurrenciesProvider';

export const TraderPage = () => {

    const traderData = useTraderDailyUpdate();

    const [watchedCurrencies] = useWatchedCurrencies();

    const primaryXAxis: AxisModel = { valueType: 'Category' };

    const eurData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.eur, text: "EUR" }));
    const usdData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.usd, text: "USD" }));
    const yenData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.yen, text: "YEN" }));
    const yuanData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.yuan, text: "YUAN" }));

    const zoomSettings: ZoomSettingsModel = {
        enableSelectionZooming: true,
    }

    const tooltip: TooltipSettingsModel = {
        enable: true,
        template: (args: { x: number, y: string, tooltip: string }) => {
            const daily_data = traderData[args.x].daily_data;
            return <div className="tooltip">
                <header>
                    <h1>
                        Day {args.x}
                    </h1>
                </header>
                <main>
                    <div><span>{args.tooltip}: </span><span>{parseFloat(args.y).toFixed(2)}</span></div>
                    <div><span>Action: </span><span>{daily_data.event}</span></div>
                    {
                        (() => {

                            switch(daily_data.event) {
                                case MarketEvent.Buy:
                                case MarketEvent.Sell: 
                                    return <>
                                        <div><span>Given {daily_data.kind_given}: </span><span>{daily_data.amount_given.toFixed(2)}</span></div>
                                        <div><span>Received {daily_data.kind_received}: </span><span>{daily_data.amount_received.toFixed(2)}</span></div>
                                    </>;
                                case MarketEvent.LockBuy:
                                case MarketEvent.LockSell:
                                    return <>
                                        <div><span>Locked {daily_data.kind_received}: </span><span>{daily_data.amount_received.toFixed(2)}</span></div>
                                        <div><span>For {daily_data.kind_given}: </span><span>{daily_data.amount_given.toFixed(2)}</span></div>
                                    </>;
                            }
                            return <></>;
                        })()
                    }
                </main>
            </div>
        },
    }

    const marker: MarkerSettingsModel = { visible: true, width: 5, height: 5, shape: 'Circle' };

    const palette = ["red", "pink", "green", "gold"];

    return (
        <div className="TraderPage">
            <ChartComponent className='chart'
                primaryXAxis={primaryXAxis}
                zoomSettings={zoomSettings} palettes={palette}
                crosshair={{enable: true}}
                tooltip={tooltip}>
                <Inject services={[LineSeries, Category, Zoom, Legend, Tooltip, Crosshair]} />
                <SeriesCollectionDirective>
                    { watchedCurrencies.EUR? <SeriesDirective dataSource={eurData} xName='x' yName='y' type='Line' name="EUR" marker={marker} tooltipMappingName='text'/> : <></> }
                    { watchedCurrencies.USD? <SeriesDirective dataSource={usdData} xName='x' yName='y' type='Line' name="USD" marker={marker} tooltipMappingName='text' /> : <></> }
                    { watchedCurrencies.YEN? <SeriesDirective dataSource={yenData} xName='x' yName='y' type='Line' name="YEN" marker={marker} tooltipMappingName='text' /> : <></> }
                    { watchedCurrencies.YUAN? <SeriesDirective dataSource={yuanData} xName='x' yName='y' type='Line' name="YUAN" marker={marker} tooltipMappingName='text' /> : <></> }
                </SeriesCollectionDirective>
            </ChartComponent>
        </div>
    )
}