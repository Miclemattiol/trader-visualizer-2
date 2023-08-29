import { AxisModel, Category, ChartComponent, Inject, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Zoom, ZoomSettingsModel } from '@syncfusion/ej2-react-charts';
import './TraderPage.scss';
import { useTraderDailyUpdate } from '../../Providers/TraderDailyUpdateProvider';

type Props = {

}

export const TraderPage = ({ }: Props) => {

    const traderData = useTraderDailyUpdate();

    const primaryXAxis: AxisModel = { valueType: 'Category' };

    const eurData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.eur, text: "EUR" }));
    const usdData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.usd, text: "USD" }));
    const yenData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.yen, text: "YEN" }));
    const yuanData = traderData.map((value, i) => ({ x: i.toString(), y: value.currencies.yuan, text: "YUAN" }));

    const zoomSettings: ZoomSettingsModel = {
        enableSelectionZooming: true,
    }

    const palette = ["red", "pink", "green", "gold"];
    
    return (
        <div className="TraderPage">
            <ChartComponent className='chart'
                primaryXAxis={primaryXAxis} 
                zoomSettings={zoomSettings} palettes={palette}>
                <Inject services={[LineSeries, Category, Zoom, Legend]} />
                <SeriesCollectionDirective>
                    <SeriesDirective dataSource={eurData} xName='x' yName='y' type='Line' name="EUR" />
                    <SeriesDirective dataSource={usdData} xName='x' yName='y' type='Line' name="USD" />
                    <SeriesDirective dataSource={yenData} xName='x' yName='y' type='Line' name="YEN" />
                    <SeriesDirective dataSource={yuanData} xName='x' yName='y' type='Line' name="YUAN" />
                </SeriesCollectionDirective>
            </ChartComponent>
        </div>
    )
}