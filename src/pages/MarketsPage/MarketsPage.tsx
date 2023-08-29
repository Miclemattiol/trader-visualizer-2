import { AxisModel, Category, ChartComponent, Inject, Legend, LineSeries, SeriesCollectionDirective, SeriesDirective, Zoom, ZoomSettingsModel } from '@syncfusion/ej2-react-charts';
import './MarketsPage.scss';
import { useMarketsUpdate } from '../../Providers/MarketsUpdateProvider';

type Props = {

}

export const MarketsPage = ({ }: Props) => {

    const marketsData = useMarketsUpdate();

    const primaryXAxis: AxisModel = { valueType: 'Category' };

    const zoomSettings: ZoomSettingsModel = {
        enableSelectionZooming: true,
    }

    const palette = ["red", "pink", "green", "gold"];

    return (
        <div className="MarketsPage">
            {Object.keys(marketsData).map((key) => {
                const eurData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.eur, text: "EUR" }));
                const usdData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.usd, text: "USD" }));
                const yenData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.yen, text: "YEN" }));
                const yuanData = marketsData[key].map((value, i) => ({ x: i.toString(), y: value.yuan, text: "YUAN" }));
                return (
                    <div className='chartContainer' key={key}>
                    <ChartComponent className='chart'
                        primaryXAxis={primaryXAxis} 
                        zoomSettings={zoomSettings} palettes={palette}
                        title={key} titleStyle={{color: "var(--text)"}}
                        
                        >
                        <Inject services={[LineSeries, Category, Zoom, Legend]} />
                        <SeriesCollectionDirective>
                            <SeriesDirective dataSource={eurData} xName='x' yName='y' type='Line' name="EUR" />
                            <SeriesDirective dataSource={usdData} xName='x' yName='y' type='Line' name="USD" />
                            <SeriesDirective dataSource={yenData} xName='x' yName='y' type='Line' name="YEN" />
                            <SeriesDirective dataSource={yuanData} xName='x' yName='y' type='Line' name="YUAN" />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                    </div>
                    // <div key={key} className='chart'/>
                )
            })}
        </div>
    )
}