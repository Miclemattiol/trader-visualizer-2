import { AxisModel, Category, ChartComponent, Crosshair, Inject, Legend, LineSeries, MarkerSettingsModel, SeriesCollectionDirective, SeriesDirective, Tooltip, TooltipSettingsModel, Zoom, ZoomSettingsModel } from '@syncfusion/ej2-react-charts';
import './MarketsPage.scss';
import { useMarketsUpdate } from '../../Providers/MarketsUpdateProvider';
import { useWatchedCurrencies } from '../../Providers/WatchedCurrenciesProvider';

type Props = {

}

export const MarketsPage = ({ }: Props) => {

    const marketsData = useMarketsUpdate();

    const [watchedCurrencies] = useWatchedCurrencies();

    const primaryXAxis: AxisModel = { valueType: 'Category' };

    const zoomSettings: ZoomSettingsModel = {
        enableSelectionZooming: true,
    }

    const tooltip: TooltipSettingsModel = {
        enable: true,
        template: (args: { x: number, y: string, tooltip: string }) => (
            <div className="tooltip">
                <header>
                    <h1>
                        Day {args.x}
                    </h1>
                </header>
                <main>
                    <div><span>{args.tooltip}: </span><span>{parseFloat(args.y).toFixed(2)}</span></div>
                </main>
            </div>
        ),
    }

    const marker: MarkerSettingsModel = { visible: true, width: 5, height: 5, shape: 'Circle' };

    const palette = ["red", "pink", "green", "gold"];

    const markets = Object.keys(marketsData).map((key) => {
        const eurData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.eur, text: "EUR" }));
        const usdData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.usd, text: "USD" }));
        const yenData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.yen, text: "YEN" }));
        const yuanData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.yuan, text: "YUAN" }));
        return (
            <div className='chartContainer' key={key}>
                <ChartComponent className='chart'
                    primaryXAxis={primaryXAxis}
                    zoomSettings={zoomSettings} palettes={palette}
                    title={key} titleStyle={{ color: "var(--text)" }}
                    tooltip={tooltip}
                    crosshair={{enable: true}}
                >
                    <Inject services={[LineSeries, Category, Zoom, Legend, Tooltip, Crosshair]} />
                    <SeriesCollectionDirective>
                        {watchedCurrencies.EUR ? <SeriesDirective dataSource={eurData} xName='x' yName='y' type='Line' name="EUR" marker={marker} tooltipMappingName='text' /> : <></>}
                        {watchedCurrencies.USD ? <SeriesDirective dataSource={usdData} xName='x' yName='y' type='Line' name="USD" marker={marker} tooltipMappingName='text' /> : <></>}
                        {watchedCurrencies.YEN ? <SeriesDirective dataSource={yenData} xName='x' yName='y' type='Line' name="YEN" marker={marker} tooltipMappingName='text' /> : <></>}
                        {watchedCurrencies.YUAN ? <SeriesDirective dataSource={yuanData} xName='x' yName='y' type='Line' name="YUAN" marker={marker} tooltipMappingName='text' /> : <></>}
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
        )
    })

    return (
        <div className="MarketsPage">
            { markets.length != 0? markets : <div className='noMarkets'><h1>No markets to be seen. <br />Try starting the trader</h1></div>}
        </div>
    )
}